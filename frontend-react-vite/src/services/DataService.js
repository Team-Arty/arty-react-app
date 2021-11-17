import axios from 'axios';

const DataService = {
    Init: function () {
        // Any application initialization logic comes here
    },
   
    Predict: async function (formData) {
        return await axios.post("http://localhost:9000" + "/predict", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    Predict_ART_Caption: async function (formData) {
        return await axios.post("http://localhost:8080" + "/predict_caption", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },


    Predict_ART_Sample: async function () {
        return await axios.get("http://localhost:8080" + "/predict_sample");
    
    
    
    },

    Text2Audio: async function (obj) {
        return await axios.post("http://localhost:9000" + "/text2audio", obj);
    }
}

export default DataService;