<?php
/**
* Template Name: Deck Tool Page Template
*
* Displays the YuGiOh Deck Tool.
*/
?>

    <?php
    function register_decktool_assets()
    {
        //CSS
        wp_register_style('decktool-css-main', 'https://ygoprodeck.com/decktool/dist/app.css');
        wp_enqueue_style('decktool-css-main');

        //Scripts

        wp_register_script('decktool-js-app', 'https://ygoprodeck.com/decktool/dist/app.js',[],"v4.12.0",true);
        wp_enqueue_script('decktool-js-app');
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
                    <header class="decktool-header">
                        <h1>YuGiOh Deck Tool</h1>
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
                                <a href="http://yugiohprices.com/" target="_blank">yugiohprices.com</a> API
                            </span>
                        </p>
                    </footer>
                </div>
            </div>

          </div>
        </div>
        <!-- #primary -->

        <?php colormag_sidebar_select(); ?>

            <?php do_action('colormag_after_body_content'); ?>

            <?php get_footer(); ?>
