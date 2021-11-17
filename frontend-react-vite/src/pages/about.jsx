import * as React from "react";
/* ADD IMPORTS FROM TODO ON THE NEXT LINE */


/**
* The About function defines the component that makes up the About page
* This component is attached to the /about path in router.jsx
*/

export default function About() {
  /* DECLARE STYLE AND TRIGGER FOR WIGGLE EFFECT FROM TODO ON NEXT LINE */
  
  return (
    <div className="page">
      {/* REPLACE H1 ELEMENT BELOW WITH CODE FROM TODO */}
      <h1 className="title">
        About Arty
      </h1>
      {/* REPLACE OPENING P TAG BELOW WITH CODE FROM TODO */}
      <p>
        The visually-imparied heavily rely upon captions for navigating the 
        internet and day-to-day life. Accessibility in the digital realm becomes 
        important in order to facilitate a more inclusive environment for everyone. 
        Image captioning via the standard COCO and Flickr Dataset for real-life objects has been done before - the captions are straightforward and objective.

      </p>
      <p>
        
          <b>But, can objectivity be maintained in the case of captioning artworks? </b>
           
      </p>
      <p>
        Artworks are highly subjective and are open to many interpretations. According to Panofsky’s three levels of analysis, captions of natural images are of ”pre-iconographic” description - an objective view where it is simply listing the elements present within an image. But for artwork images, this type of description does not adequately represent the tonality or accurate description of the painting. In the context of artwork images, it would be more interesting to generate ”iconographic” captions that capture the subject and symbolic relations between objects.
        
      </p>
      <p>
        Arty has been developed to address these concerns by bringing to you the power
        of AI Image captioning!!
      </p>
      <ul>
        <li>
          🎉 Right now, our site is <strong>live on the web</strong> 🌐 with a
          the URL.{}
        </li>
        <li>
          💥 Upload a picture, be it any picture or artwork.
        </li>
        <li>
          🌈 Use the <strong>Talk</strong> button in the Arty editor to
          get the caption read out aloud. <br />
        </li>
      </ul>

      <p>
        {" "}
        We can't wait for you to try out our app and let us know your thoughts!
      </p>
      <p>
        Built with <a href="https://reactjs.org/">React</a> and{" "}
        <a href="https://vitejs.dev/">Vite</a> on{" "}
        <a href="https://glitch.com/">Glitch</a>.
      </p>
    </div>
  );
}
