# Arty-app

**Team Members: Niegil, Sakthisree, Surojit, Anah, Shivani, Nagapriya**

**Arty** - the app that lets individuals with visual impairments experience museum art via subjective and emotive captions that are played out loud for the user.

A sample output for a painting
<img src="arty_painting.gif" alt="App" width="1000"/>
A sample output for a real life image
<img src="arty.gif" alt="App" width="1000"/>

This project was based on [artemis](https://arxiv.org/abs/2101.07396) and provides three model outputs. The first model was trained on the COCO,Flickr 8K and Iconclass datasets, whereas the second and third model was trained on the ArtEmis dataset. The third model differs from the second in that it undergoes two stages :
- A ground emotion is predicted by the image to emotion classifier  
- The predicted emotion is fed into the image to caption generator

This gives the model a more emoted caption as compared to the other two models. 

