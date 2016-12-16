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

		wp_register_script('priceapp-js-app','https://ygoprodeck.com/priceapp/js/main.js');
    wp_enqueue_script('priceapp-js-app');

}

add_action('wp_enqueue_scripts', 'register_priceapp_assets');
?>

<?php get_header(); ?>

	<?php do_action( 'colormag_before_body_content' ); ?>

	<div id="primary">
		<div id="content" class="clearfix"  >
			<?php //get_template_part( 'content', 'page' ); ?>


			<!--YGODeckPrice App-->
      <main >
          <div class="priceapp" id="app">
              <header>
                  <h1>YuGiOh Deck Price v2.0</h1>
                  <h2>Check the average price for your YgoPro/DevPro .ydk files</h2>
              </header>
              <main>
                  <div class="row">
                      <div class="col-xs-12">
                          <form class="form">
                              <div class="form-group row">
                                  <label class="col-xs-12 col-md-3 col-form-label" for="formUploadDeck">Upload Deck:</label>
                                  <div class="col-xs-12 col-md-9">
                                      <input class="form-control" id="formUploadDeck" type="file" accept=".ydk" value="Select Deck" @change="onFileChange">
                                  </div>
                              </div>
                              <div class="form-group row">
                                  <label class="col-xs-12 col-md-3 col-form-label" for="formLinkShare">Share Link:</label>
                                  <div class="col-xs-12 col-md-9">
                                      <input class="form-control" id="formLinkShare" type="url" v-bind:value="uriLocationNoParam() + deck.link">
                                  </div>
                              </div>
                              <div class="form-group row">
                                  <label class="col-xs-12 col-md-3 col-form-label">Price Settings:</label>
                                  <div class="col-xs-12 col-md-5">
                                      <select class="form-control" v-model="price.activeCurrency">
                                          <option v-for="currency in price.currencies" v-bind:value="currency.id">{{currency.name}}</option>
                                      </select>
                                  </div>
                                  <div class="col-xs-12 col-md-4">
                                      <div class="btn btn-primary form-control" @click="apiLoadPrices()"><span v-bind:hidden="ajax.currentlyLoading">Load Prices</span><span v-bind:hidden="!ajax.currentlyLoading"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i></span>
                                      </div>
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-xs-12">
                          <div class="deck" v-if="ajax.namesLoaded">
                              <div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
                                  <div class="deck-title">
                                      <h3>Total:</h3>
                                      <div class="deck-price"><span class="deck-price-item" v-for="mode in price.modes" v-bind:style="'background-color:'+mode.color">{{priceForSection("*",mode.id)}}</span>
                                      </div>
                                  </div>
                              </div>
                              <div class="deck-part" v-for="deckpart in deckparts" v-if="deck.list[deckpart.id]">
                                  <div class="deck-title">
                                      <h3>{{deckpart.name}}:</h3>
                                      <div class="deck-price" v-if="ajax.pricesLoaded"><span class="deck-price-item" v-for="mode in price.modes" v-bind:style="'background-color:'+mode.color">{{priceForSection(deckpart.id,mode.id)}}</span>
                                      </div>
                                  </div>
                                  <div class="deck-content" v-bind:style="'background-color:'+deckpart.color" v-if="cards.data">
                                      <a class="deck-card" target="_blank" v-for="cardId in deck.list[deckpart.id]" v-if="cards.data[cardId]" v-bind:href="cards.data[cardId].link">
                                          <div class="deck-card-image">
                                              <img width="150" height="220" v-bind:src="cards.data[cardId].img">
                                          </div>
                                          <div class="deck-card-text">
                                              <div class="deck-card-name">{{cards.data[cardId].name}}</div>
                                              <div class="deck-price deck-price--sm" v-if="ajax.pricesLoaded"><span class="deck-price-item" v-for="mode in price.modes" v-bind:style="'background-color:'+mode.color">{{priceForCard(cardId,mode.id)}}</span>
                                              </div>
                                          </div>
                                      </a>
                                  </div>
                              </div>
                          </div>
                      </div>
      </main>



		</div><!-- #content -->
	</div><!-- #primary -->

	<?php colormag_sidebar_select(); ?>

	<?php do_action( 'colormag_after_body_content' ); ?>

<?php get_footer(); ?>
