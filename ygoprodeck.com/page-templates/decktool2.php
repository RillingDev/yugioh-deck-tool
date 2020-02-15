<?php
/**
* Template Name: Deck Tool Debug Page Template
*
* Displays the YuGiOh Deck Tool.
*/
?>

<?php
    function register_decktool_assets(){
        //CSS
        wp_register_style('decktool-css-vendor', 'https://ygoprodeck.com/decktool2/dist/css/app.css');
        wp_enqueue_style('decktool-css-vendor');
        wp_register_style('decktool-css-main', 'https://ygoprodeck.com/decktool2/dist/css/chunk-vendors.css');
        wp_enqueue_style('decktool-css-main');

        //Scripts

        wp_register_script('decktool-js-vendor', 'https://ygoprodeck.com/decktool2/dist/js/chunk-vendors.js', [], "v4.13.0", true);
        wp_enqueue_script('decktool-js-vendor');
        wp_register_script('decktool-js-app', 'https://ygoprodeck.com/decktool2/dist/js/app.js', [], "v4.13.0", true);
        wp_enqueue_script('decktool-js-app');

        wp_register_script('decktool-js-app2', 'https://ygoprodeck.com/html2canvas.js?v=1.0.0', [], "v1.0.0", true);
        wp_enqueue_script('decktool-js-app2');
    }

    add_action('wp_enqueue_scripts', 'register_decktool_assets');
?>

<?php get_header(); ?>

<?php do_action('colormag_before_body_content'); ?>

<div id="primary">
    <div id="content" class="clearfix">
        <!--YGODeckPrice App-->
        <div class="decktool">
            <div class="container">
                <header class="decktool-header"><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <h1>Yu-Gi-Oh! Deck Builder</h1>
                    <p>A tool to view deck prices, share and edit decks, create random decks and much more</p>
                </header>
                <main>
                    <div id="decktoolApp"></div>
                </main>
                <footer class="decktool-footer">
                    <p>
                        <span>Created by
                            <a href="https://f-rilling.com/" target="_blank">Felix Rilling</a>
                        </span>
                        |
                        <span>
                            <a href="https://github.com/FelixRilling/yugioh-deck-tool" target="_blank">Project source code</a>
                        </span>
                        |
                        <span>Price data from the
                            <a href="http://yugiohprices.com/" target="_blank">yugiohprices.com</a> API.
                        </span>

                        <button title="Screenshot Deck" class="btn btn-primary form-control" style="width:55%;display: block;margin-top: 10px;" onclick="screenshot()" id="screenshotdeck">Screenshot Deck  <i class="fas fa-camera"></i></button>

                        <span class="scrmessage"></span>

    <input type="hidden" name="img_val" id="img_val" value="" />


                    </p>

		    <!-- Ad Code -->
		    <div id='Ygoprodeck_Horizontal_BTF'></div>
		    <div id='Ygoprodeck_Mobile_300x250'></div>
		    <!-- End Ad Code -->


                </footer>
            </div>
        </div>
    </div>
</div>

<script>


function screenshot() {

    //Message
    jQuery( ".scrmessage" ).append( "<p class='img_gen'>Generating Screenshot. Please wait...</p>" );

    //Disable button for spam clicking
    jQuery('#screenshotdeck').attr('disabled', true);

    //Re-arrange Display for Optimal Canvas Screenshot
      if (jQuery(window).width() < 768) {
        jQuery(".no-sidebar-full-width #primary").css("width", "1110px");
      }
     jQuery(".app-deck").css("width", "1110px");
     if(!jQuery('.deck-part.deck-part-side .deck-content').length )
        {
            jQuery(".deck-part.deck-part-side").css("display", "none");
        }
     if(!jQuery('.deck-part.deck-part-extra .deck-content').length )
        {
            jQuery(".deck-part.deck-part-extra").css("display", "none");
        }

      jQuery(".deck-part").css("margin-bottom", "0");




  html2canvas(document.querySelector(".deck"), {scale: 2}).then(function(canvas) {

      document.getElementById('img_val').value = canvas.toDataURL("image/png");

      //Reset Deck Display for Optimal Screen View
      if (jQuery(window).width() < 768) {
        jQuery(".no-sidebar-full-width #primary").removeAttr( 'style' );
      }
      jQuery(".app-deck").removeAttr( 'style' );
      jQuery(".deck-part.deck-part-side").removeAttr( 'style' );
      jQuery(".deck-part.deck-part-extra").removeAttr( 'style' );
      jQuery(".deck-part").removeAttr( 'style' );

      postToImgur()
 });
}

window.postToImgur = function postToImgur() {
  var formData = new FormData();
  formData.append("image", document.getElementById("img_val").value);
  jQuery.ajax({
    url: 'https://api.imgur.com/3/image',
    method: 'POST',
    headers: {
      "Authorization": "Client-ID " + "1a9ca88ce5ec073",
      Accept: 'application/json'
    },
    data: {
      image: document.getElementById("img_val").value.replace("data:image/png;base64,", ""),
      type: 'base64'
    },
    success: function(result) {

      //Success Message
      jQuery( ".img_gen" ).remove();
      jQuery( ".scrmessage" ).append( "<p style='color:#44bc09;'>Success. The screenshot will be opened in a new tab.<br>Direct Image Link: <a href='"+result.data.link+"' target='_blank'>"+result.data.link+"</a></p>" );

      var id = result.data.link;
      window.open(id, '_blank');
      //alert(id);

      //Re-enable button
      jQuery('#screenshotdeck').attr('disabled', false);
    }
  });

}

</script>

<style>
/* The Modal (background) */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

/* The Close Button */
.close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}
</style>

<!-- #primary -->

<?php colormag_sidebar_select(); ?>

<?php do_action('colormag_after_body_content'); ?>

<?php get_footer(); ?>
