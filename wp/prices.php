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
    wp_register_script('angularjs','https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js');
    wp_enqueue_script('angularjs');

		wp_register_script('priceapp-js-app','https://ygoprodeck.com/priceapp/js/app.js');
    wp_enqueue_script('priceapp-js-app');
		wp_register_script('priceapp-js-service','https://ygoprodeck.com/priceapp/js/service.js');
		wp_enqueue_script('priceapp-js-service');
		wp_register_script('priceapp-js-directive','https://ygoprodeck.com/priceapp/js/directive.js');
		wp_enqueue_script('priceapp-js-directive');
		wp_register_script('priceapp-js-controller','https://ygoprodeck.com/priceapp/js/controller.js');
		wp_enqueue_script('priceapp-js-controller');

}

add_action('wp_enqueue_scripts', 'register_priceapp_assets');
?>

<?php get_header(); ?>

	<?php do_action( 'colormag_before_body_content' ); ?>

	<div id="primary">
		<div id="content" class="clearfix"  ng-app="ygodeckprice">
			<?php //get_template_part( 'content', 'page' ); ?>


			<!--YGODeckPrice App-->
      <main class="priceapp" ng-controller="MainController as main">
        <div class="container">
          <div class="row">
              <div class="col-xs-12">
                  <form class="form">
                      <div class="form-group row">
                          <label class="col-xs-12 col-md-3 col-form-label" for="formUploadDeck">Upload Deck:</label>
                          <div class="col-xs-12 col-md-9">
                              <input class="form-control" id="formUploadDeck" type="file" accept=".ydk" on-read-file="main.onUpload($fileContent,$fileName)" value="Select Deck">
                          </div>
                      </div>
                      <div class="form-group row" ng-show="main.data.cards.deck.sharelink">
                          <label class="col-xs-12 col-md-3 col-form-label" for="formLinkShare">Share Link:</label>
                          <div class="col-xs-12 col-md-9">
                              <input class="form-control" id="formLinkShare" type="url" value="{{main.data.cards.deck.sharelink}}">
                          </div>
                      </div>
                      <div class="form-group row" ng-show="main.data.options.loaded">
                          <label class="col-xs-12 col-md-3 col-form-label">Price Settings:</label>
                          <div class="col-xs-12 col-md-5">
                              <select class="form-control" ng-model="main.data.options.price.currency">
                                  <option ng-repeat="currency in main.data.price.currency" value="{{currency.id}}">{{currency.name}}</option>
                              </select>
                          </div>
                          <div class="col-xs-12 col-md-4">
                              <div class="btn btn-primary form-control" ng-click="main.loadPrices()"><span ng-hide="main.data.options.activeAjax">Load Prices</span><span ng-show="main.data.options.activeAjax"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i></span>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
          <div class="row" ng-hide="!main.data.options.loaded">
              <div class="col-xs-12">
                  <div class="deck">
                      <div class="deck-part deck-main">
                          <div class="deck-title" ng-hide="!main.data.cards.deck.price.total.low">
                              <h3>Total:</h3>
                              <div class="deck-total"><span ng-repeat="price in main.data.cards.deck.price.total track by $index" style="background-color:{{main.data.price.modes[$index].color}}">{{main.data.price.modes[$index].name}}: {{main.calcPrice(price)}}</span>
                              </div>
                          </div>
                      </div>
                      <div class="deck-part" ng-repeat="deckpart in main.data.cards.deck.parts" ng-hide="!main.data.cards.deck.cards[deckpart.id]">
                          <div class="deck-title">
                              <h3>{{deckpart.name}}:</h3>
                              <div class="deck-total" ng-hide="!main.data.cards.deck.price[deckpart.id].low"><span ng-repeat="price in main.data.cards.deck.price[deckpart.id] track by $index" style="background-color:{{main.data.price.modes[$index].color}}">{{main.data.price.modes[$index].name}}: {{main.calcPrice(price)}}</span>
                              </div>
                          </div>
                          <div class="deck-content" style="background-color:{{deckpart.color}}">
                              <a class="deck-card" ng-repeat="card in main.data.cards.deck.cards[deckpart.id] track by $index" ng-href="{{card.link}}" target="_blank">
                                  <div class="deck-card-image">
                                      <img ng-src="{{card.image}}" err-src="./assets/error.png" width="150" height="220">
                                  </div>
                                  <div class="deck-card-text">
                                      <div class="deck-card-name">{{card.name}}</div>
                                      <div class="deck-card-price" ng-hide="!card.price.low">
                                          <p ng-repeat="price in card.price track by $index" style="background-color:{{main.data.price.modes[$index].color}}">{{i}}{{main.calcPrice(price)}}</p>
                                      </div>
                                  </div>
                              </a>
                          </div>
                      </div>
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
