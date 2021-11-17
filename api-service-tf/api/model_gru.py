import numpy as np
from glob import glob
import os
import json
# Tensorflow
import tensorflow as tf
from tensorflow import keras

class CNN_Encoder(tf.keras.Model):
    def __init__(self, embedding_dim = 256):
        super(CNN_Encoder, self).__init__()
        C = tf.keras.initializers.Constant
        #Change path to the encoder_layer_weights
        w1, w2 = [np.load("api/layer_%s_%s_weights_%s.npy" %(0, "dense", j)) \
                                      for j in range(2)]
        self.fc = tf.keras.layers.Dense(embedding_dim, kernel_initializer=C(w1), bias_initializer=C(w2))

    def call(self, x):
        x = self.fc(x)
        x = tf.nn.relu(x)
        return x


class BahdanauAttention(tf.keras.Model):
    def __init__(self, units = 512):
        super(BahdanauAttention, self).__init__()
        C = tf.keras.initializers.Constant
        #Change path to decoder_layer_weights
        w1, w2, w3, w4, w5, w6 = [np.load("api/decoder-layer-weights/layer_%s_%s_weights_%s.npy" %(4, "bahdanau_attention", j)) \
                                  for j in range(6)]
        self.W1 = tf.keras.layers.Dense(units, kernel_initializer=C(w1), bias_initializer=C(w2))
        self.W2 = tf.keras.layers.Dense(units, kernel_initializer=C(w3), bias_initializer=C(w4))
        self.V = tf.keras.layers.Dense(1, kernel_initializer=C(w5), bias_initializer=C(w6))

    def call(self, features, hidden):

        hidden_with_time_axis = tf.expand_dims(hidden, 1)

        score = tf.nn.tanh(self.W1(features) + self.W2(hidden_with_time_axis))
        attention_weights = tf.nn.softmax(self.V(score), axis=1)

        # context_vector shape after sum == (batch_size, hidden_size)
        context_vector = attention_weights * features
        context_vector = tf.reduce_sum(context_vector, axis=1)

        return context_vector, attention_weights


class RNN_Decoder(tf.keras.Model):
    def __init__(self, embedding_dim= 256, units= 512, vocab_size= 10000 + 1):
        super(RNN_Decoder, self).__init__()
        self.units = units

        C = tf.keras.initializers.Constant
        w_emb = np.load("api/decoder-layer-weights/layer_%s_%s_weights_%s.npy" %(0, "embedding", 0))
        w_gru_1, w_gru_2, w_gru_3 = [np.load("api/decoder-layer-weights/layer_%s_%s_weights_%s.npy" %(1, "gru", j)) for j in range(3)]
        w1, w2 = [np.load("api/decoder-layer-weights/layer_%s_%s_weights_%s.npy" %(2, "dense_1", j)) for j in range(2)]
        w3, w4 = [np.load("api/decoder-layer-weights/layer_%s_%s_weights_%s.npy" %(3, "dense_2", j)) for j in range(2)]

        self.embedding = tf.keras.layers.Embedding(vocab_size, embedding_dim, embeddings_initializer=C(w_emb))
        self.gru = tf.keras.layers.GRU(self.units,
                                       return_sequences=True,
                                       return_state=True,
                                       kernel_initializer=C(w_gru_1),
                                       recurrent_initializer=C(w_gru_2),
                                       bias_initializer=C(w_gru_3)
                                       )
        self.fc1 = tf.keras.layers.Dense(self.units, kernel_initializer=C(w1), bias_initializer=C(w2))
        self.fc2 = tf.keras.layers.Dense(vocab_size, kernel_initializer=C(w3), bias_initializer=C(w4))

        self.attention = BahdanauAttention(self.units)

    def call(self, x, features, hidden):
        context_vector, attention_weights = self.attention(features, hidden)

        x = self.embedding(x)
        x = tf.concat([tf.expand_dims(context_vector, 1), x], axis=-1)

        output, state = self.gru(x)
        x = self.fc1(output)
        x = tf.reshape(x, (-1, x.shape[2]))
        x = self.fc2(x)

        return x, state, attention_weights

    def reset_state(self, batch_size):
        return tf.zeros((batch_size, self.units))

def load_image(image_path):
    img = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, (299, 299))
    img = tf.keras.applications.inception_v3.preprocess_input(img)
    return img, image_path
    

def predict_GRU(image):
    #Change path to tokenizer
    with open('api/tokenizer.json') as f:
        data = json.load(f)
        tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(data)

    encoder = CNN_Encoder()
    decoder = RNN_Decoder()
    inception_model = tf.keras.models.load_model('api/inception.hdf5') #Change path to inception.hdf5

    attention_plot = np.zeros((52, 64))

    hidden = decoder.reset_state(batch_size=1)

    temp_input = tf.expand_dims(load_image(image)[0], 0)
    img_tensor_val = inception_model(temp_input)
    img_tensor_val = tf.reshape(img_tensor_val, (img_tensor_val.shape[0],
                                                 -1,
                                                 img_tensor_val.shape[3]))

    features = encoder(img_tensor_val)
    alt_input = tf.expand_dims([tokenizer.word_index['<start>']], 0)
    alternate_result = []
    for i in range(52):
        alt_predictions, hidden, attention_weights = decoder(alt_input,
                                                         features,
                                                         hidden)
        alternate_id = tf.math.argmax(alt_predictions, 1)[0].numpy()
        if tokenizer.index_word[alternate_id] == '<unk>':
          while tokenizer.index_word[alternate_id] == '<unk>':
            alternate_id = tf.random.categorical(alt_predictions, 1)[0][0].numpy()
        alternate_result.append(tokenizer.index_word[alternate_id])
        if tokenizer.index_word[alternate_id] == '<end>':
            return ' '.join(alternate_result).replace('<end>','.').capitalize()

        alt_input = tf.expand_dims([alternate_id], 0)
    return ' '.join(alternate_result).replace('<end>','.').capitalize()