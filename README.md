# Arty-app

**Team Members: Niegil, Sakthisree, Surojit, Anah, Shivani, Nagapriya**

The final project titled **Arty** aims to create an app that allows people with disabilities to recieve a subjective caption of museum art. 

This project was based on [artemis](https://arxiv.org/abs/2101.07396) and provides three model outputs. The first model was trained on the COCO,Flickr 8K and Iconclass datasets, whereas the second and third model was trained on the ArtEmis dataset. The third model differs from the second in that it undergoes two stages :
- A ground emotion is predicted by the image to emotion classifier  
- The predicted emotion is fed into the image to caption generator

This gives the model a more subjective caption as compared to the other two models.  

A sample output for a painting
<img src="arty_painting.gif" alt="App" width="1000"/>
A sample output for a real life image
<img src="arty.gif" alt="App" width="1000"/>

Here we can see the difference in outputs. The model trained mainly on the COCO and Flickr datasets fails to give an accurate caption for the painting.

