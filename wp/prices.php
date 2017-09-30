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
        wp_register_style('priceapp-css-main', 'https://ygoprodeck.com/priceapp/css/app.css');
        wp_enqueue_style('priceapp-css-main' );

        //Scripts

        wp_register_script('priceapp-js-app', 'https://ygoprodeck.com/priceapp/js/app.js');
        wp_enqueue_script('priceapp-js-app');
    }

    add_action('wp_enqueue_scripts', 'register_priceapp_assets');
?>

    <?php get_header(); ?>

        <?php do_action( 'colormag_before_body_content' ); ?>

        <div id="primary">
          <div id="content" class="clearfix">

            <!--YGODeckPrice App-->
            <div class="priceapp">
            <header>
                <h1>YuGiOh Deck Price v3.0</h1>
                <h2>Check the average price for your YgoPro/DevPro .ydk files</h2>
            </header>
            <main class="main" id="app">
                <div class="main-form">
                    <div class="form-app-wrapper form-group"><label class="form-app-label">Deck:</label>
                        <div class="form-app-item"><input class="form-control" id="formUploadDeck" type="file" title="Upload Deck" accept=".ydk" @change="fileOnUpload">
                            <input class="form-control deck-name" type="text" title="Deck Title" placeholder="Deck Title" v-model="deck.name" @input="deckUpdate()"></div>
                        <a class="btn btn-primary form-control" title="Download Deck" download @click="fileDownloadDeck()">Download</a>
                    </div>
                    <div class="form-app-wrapper form-group"><label class="form-app-label">Share:</label>
                        <div class="form-app-item"><input class="form-control" id="formLinkShare" type="url" title="Shareable Link" v-bind:value="uriLocationNoParam() + deck.link"></div>
                        <a class="btn btn-primary form-control" title="Copy Decklist to Clipboard" @click="shareText()">Copy Decklist to Clipboard</a>
                    </div>
                    <div class="form-app-wrapper form-group"><label class="form-app-label">Price:</label>
                        <div class="form-app-item"><select class="form-control deck-currency" title="Price Currency" v-model="price.activeCurrency"><option v-for="currency in price.currencies" v-bind:value="currency.id">{{currency.name}}</option></select></div>
                        <div class="btn btn-primary form-control" title="Load Prices" @click="apiLoadPrices()"><span v-bind:hidden="ajax.currentlyLoading">Load Prices</span><span v-bind:hidden="!ajax.currentlyLoading"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i></span></div>
                    </div>
                </div>
                <div class="main-deck">
                    <h3>Decklist:</h3>
                    <div class="deck" v-if="ajax.namesLoaded">
                        <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                            <div class="deck-title">
                                <h4>Total:</h4>
                                <div class="deck-price"><span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForSection("*",mode.id)}}</span></div>
                            </div>
                        </div>
                        <div class="deck-part" v-for="deckpart in deckparts" v-bind:class="'deck-part-'+deckpart.id">
                            <div class="deck-title">
                                <h4>{{deckpart.name}} Deck ({{deck.list[deckpart.id].length}} Cards):</h4>
                                <div class="deck-price" v-if="ajax.pricesLoaded"><span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForSection(deckpart.id,mode.id)}}</span></div>
                            </div>
                            <div class="deck-content" v-if="cards.data">
                                <a class="deck-card" target="_blank" v-for="cardId in deck.list[deckpart.id]" v-if="cards.data[cardId]" v-bind:href="cards.data[cardId].link"
                                    @contextmenu.prevent="builderDeckRemove(cardId,deckpart.id)">
                                    <div class="deck-card-image"><img width="100" height="144" v-bind:src="cards.data[cardId].img"></div>
                                    <div class="deck-card-text">
                                        <div class="deck-card-name">{{cards.data[cardId].name}}</div>
                                        <div class="deck-price deck-price--sm" v-if="ajax.pricesLoaded"><span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForCard(cardId,mode.id)}}</span></div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-builder">
                    <h3>Deckbuilder:</h3>
                    <div class="builder">
                        <p>Showing {{builder.pairsFiltered.length}} of {{cards.pairs.length}} Cards</p>
                        <div class="form"><input class="form-control builder-search" id="builderSearch" type="text" title="Search Query" placeholder="Search"
                                v-model="builder.filter" @input="builderUpdateNames()"></div>
                        <ul class="builder-list">
                            <li class="builder-card" v-for="card in builder.pairsFiltered">
                                <div class="builder-card-action">
                                    <div class="fa fa-plus deck-part" v-for="deckpart in deckparts" v-bind:class="'deck-part-'+deckpart.id" @click="builderDeckAdd(card[0],deckpart.id)"
                                        v-bind:title="'Add Card to '+deckpart.name+' Deck'"></div>
                                </div>
                                <div class="builder-card-name">{{card[1]}}</div>
                            </li>
                        </ul>
                        <div class="builder-description">
                            <p>- Use the pluses to add a card.</p>
                            <p>- Right-click a card in the deck to remove it.</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <p>Price data and Images from the <a href="http://yugiohprices.com/" target="_blank">yugiohprices.com</a> API</p>
            </footer>
        </div>

          </div>
        </div>
        <!-- #primary -->

        <?php colormag_sidebar_select(); ?>

            <?php do_action( 'colormag_after_body_content' ); ?>

            <?php get_footer(); ?>
