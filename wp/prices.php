<?php
/**
* Template Name: Price App Page Template
*
* Displays the Contact Page Template of the theme.
*
* @package ThemeGrill
* @subpackage ColorMag
* @since ColorMag 1.0
* @version 6
*/
?>

    <?php
    function register_priceapp_assets()
    {
        //CSS
        wp_register_style('priceapp-css-main', 'https://ygoprodeck.com/priceapp/app.css');
        wp_enqueue_style('priceapp-css-main');

        //Scripts

        wp_register_script('priceapp-js-app', 'https://ygoprodeck.com/priceapp/app.js');
        wp_enqueue_script('priceapp-js-app');
    }

    add_action('wp_enqueue_scripts', 'register_priceapp_assets');
?>

    <?php get_header(); ?>

        <?php do_action('colormag_before_body_content'); ?>

        <div id="primary">
          <div id="content" class="clearfix">

            <!--YGODeckPrice App-->
            <div class="container priceapp">
                <header class="priceapp-header">
                    <h1>YuGiOh Deck Price v4.0</h1>
                    <p>Check the average price for your YgoPro/DevPro .ydk files</p>
                </header>
                <main>
                    <div id="appYgodeckprice"></div>
                </main>
                <footer class="priceapp-footer">
                    <p>
                        <span>Created by
                            <a href="https://f-rilling.com/" target="_blank">Felix Rilling</a>
                        </span>
                        |
                        <span>
                            <a href="https://github.com/FelixRilling/ygodeckprice3" target="_blank">Project Sourcecode</a>
                        </span>
                        |
                        <span>Price data from the
                            <a href="http://yugiohprices.com/" target="_blank">yugiohprices.com</a> API
                        </span>
                    </p>
                </footer>
            </div>

          </div>
        </div>
        <!-- #primary -->

        <?php colormag_sidebar_select(); ?>

            <?php do_action('colormag_after_body_content'); ?>

            <?php get_footer(); ?>
