<?php
/**
* Template Name: Price App Page Template
*
* Displays the Contact Page Template of the theme.
*
* @package ThemeGrill
* @subpackage ColorMag
* @since ColorMag 1.0
*/
?>

  <?php
function register_priceapp_assets(){
    //CSS
    wp_register_style('priceapp-css-bootstrap', 'https://ygoprodeck.com/priceapp/css/lib/bootstrap.css');
    wp_enqueue_style('priceapp-css-bootstrap' );
    wp_register_style('priceapp-css-main', 'https://ygoprodeck.com/priceapp/css/app.css');
    wp_enqueue_style('priceapp-css-main' );

    //Scripts

    wp_register_script('priceapp-js-app','https://ygoprodeck.com/priceapp/js/app.js');
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
                  <div class="form-app-group">
                    <div class="form-app-label">
                      <label>Deck:</label>
                    </div>
                    <div class="form-app-field-primary">
                      <input class="form-control" id="formUploadDeck" title="Upload Deck" type="file" accept=".ydk" @change="onFileChange">
                    </div>
                    <div class="form-app-field-secondary">
                      <input class="form-control" title="Deck Title" placeholder="Deck Title" type="text" v-model="deck.name" @input="deckUpdate()">
                    </div>
                  </div>
                  <div class="form-app-group">
                    <div class="form-app-label">
                      <label>Share:</label>
                    </div>
                    <div class="form-app-field-primary">
                      <input class="form-control" id="formLinkShare" title="Shareable Link" type="url" v-bind:value="uriLocationNoParam() + deck.link">
                    </div>
                    <div class="form-app-field-secondary"><a class="btn btn-primary form-control" title="Download Deck" download @click="fileDownloadDeck()">Download</a>
                    </div>
                  </div>
                  <div class="form-app-group">
                    <div class="form-app-label">
                      <label>Price:</label>
                    </div>
                    <div class="form-app-field-primary">
                      <select class="form-control" title="Price Currency" v-model="price.activeCurrency">
                        <option v-for="currency in price.currencies" v-bind:value="currency.id">{{currency.name}}</option>
                      </select>
                    </div>
                    <div class="form-app-field-secondary">
                      <div class="btn btn-primary form-control" title="Load Prices" @click="apiLoadPrices()"><span v-bind:hidden="ajax.currentlyLoading">Load Prices</span><span v-bind:hidden="!ajax.currentlyLoading"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="main-deck">
                  <h3>Decklist:</h3>
                  <div class="deck" v-if="ajax.namesLoaded">
                    <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                      <div class="deck-title">
                        <h4>Total:</h4>
                        <div class="deck-price"><span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForSection("*",mode.id)}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="deck-part" v-for="deckpart in deckparts" v-bind:class="'deck-part-'+deckpart.id">
                      <div class="deck-title">
                        <h4>{{deckpart.name}} Deck ({{deck.list[deckpart.id].length}} Cards):</h4>
                        <div class="deck-price" v-if="ajax.pricesLoaded"><span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForSection(deckpart.id,mode.id)}}</span>
                        </div>
                      </div>
                      <div class="deck-content" v-if="cards.data">
                        <a class="deck-card" target="_blank" v-for="cardId in deck.list[deckpart.id]" v-if="cards.data[cardId]" v-bind:href="cards.data[cardId].link" @contextmenu.prevent="builderDeckRemove(cardId,deckpart.id)">
                          <div class="deck-card-image">
                            <img width="100" height="144" v-bind:src="cards.data[cardId].img">
                          </div>
                          <div class="deck-card-text">
                            <div class="deck-card-name">{{cards.data[cardId].name}}</div>
                            <div class="deck-price deck-price--sm" v-if="ajax.pricesLoaded"><span class="deck-price-item pricemode" v-for="mode in price.modes" v-bind:class="'pricemode-'+mode.id">{{priceForCard(cardId,mode.id)}}</span>
                            </div>
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
                    <div class="form">
                      <input class="form-control builder-search" id="builderSearch" title="Search Query" placeholder="Search" type="text" v-model="builder.filter" @input="builderUpdateNames()">
                    </div>
                    <ul class="builder-list">
                      <li class="builder-card" v-for="card in builder.pairsFiltered">
                        <div class="builder-card-action">
                          <div class="fa fa-plus deck-part" v-for="deckpart in deckparts" v-bind:class="'deck-part-'+deckpart.id" @click="builderDeckAdd(card[0],deckpart.id)" v-bind:title="'Add Card to '+deckpart.name+' Deck'"></div>
                        </div>
                        <div class="builder-card-name">{{card[1]}}</div>
                      </li>
                    </ul>
                    <div class="builder-description">
                      <p>- Click the pluses in the list to add a card.</p>
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
