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
			<div class="priceapp">
				<main id="app">
					<div class="main-form">
						<div class="form">
							<div class="form-app-group">
								<div class="form-app-label">
									<label>Deck:</label>
								</div>
								<div class="form-app-field-primary">
									<input class="form-control" id="formUploadDeck" type="file" accept=".ydk" @change="onFileChange" title="Upload Deck">
								</div>
								<div class="form-app-field-secondary">
									<input class="form-control" type="text" placeholder="Deck Title" v-model="deck.name" @input="deckUpdate()">
								</div>
							</div>
							<div class="form-app-group">
								<div class="form-app-label">
									<label>Share:</label>
								</div>
								<div class="form-app-field-primary">
									<input class="form-control" id="formLinkShare" type="url" v-bind:value="uriLocationNoParam() + deck.link" title="Shareable Link">
								</div>
								<div class="form-app-field-secondary"><a class="btn btn-primary form-control" download @click="fileDownloadDeck()">Download</a>
								</div>
							</div>
							<div class="form-app-group">
								<div class="form-app-label">
									<label>Price:</label>
								</div>
								<div class="form-app-field-primary">
									<select class="form-control" v-model="price.activeCurrency" title="Price Currency">
										<option v-for="currency in price.currencies" v-bind:value="currency.id">{{currency.name}}</option>
									</select>
								</div>
								<div class="form-app-field-secondary">
									<div class="btn btn-primary form-control" @click="apiLoadPrices()" title="Load Prices"><span v-bind:hidden="ajax.currentlyLoading">Load Prices</span><span v-bind:hidden="!ajax.currentlyLoading"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="main-row">
						<div class="main-deck">
							<div v-if="ajax.namesLoaded">
								<h3>Decklist:</h3>
								<div class="deck">
									<div class="deck-part deck-part-total" v-if="ajax.pricesLoaded">
										<div class="deck-title">
											<h4>Total:</h4>
											<div class="deck-price"><span class="deck-price-item" v-for="mode in price.modes" v-bind:style="'background-color:'+mode.color">{{priceForSection("*",mode.id)}}</span>
											</div>
										</div>
									</div>
									<div class="deck-part" v-for="deckpart in deckparts" v-if="deck.list[deckpart.id] &amp;&amp; deck.list[deckpart.id].length">
										<div class="deck-title">
											<h4>{{deckpart.name}} Deck ({{deck.list[deckpart.id].length}} Cards):</h4>
											<div class="deck-price" v-if="ajax.pricesLoaded"><span class="deck-price-item" v-for="mode in price.modes" v-bind:style="'background-color:'+mode.color">{{priceForSection(deckpart.id,mode.id)}}</span>
											</div>
										</div>
										<div class="deck-content" v-bind:style="'background-color:'+deckpart.color" v-if="cards.data">
											<a class="deck-card" target="_blank" v-for="cardId in deck.list[deckpart.id]" v-if="cards.data[cardId]" v-bind:href="cards.data[cardId].link" @contextmenu.prevent="builderDeckRemove(cardId,deckpart.id)">
												<div class="deck-card-image">
													<img width="100" height="144" v-bind:src="cards.data[cardId].img">
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
						</div>
						<div class="main-builder">
							<div v-if="ajax.namesLoaded">
								<h3>Deckbuilder:</h3>
								<div class="builder">
									<p>Showing {{builder.pairsFiltered.length}} of {{cards.pairs.length}} Cards</p>
									<div class="form">
										<input class="form-control builder-search" id="builderSearch" type="text" placeholder="Search" v-model="builder.filter" @input="builderUpdateNames()">
									</div>
									<ul class="builder-list">
										<li class="builder-card" v-for="card in builder.pairsFiltered">
											<div class="builder-card-action">
												<div class="fa fa-plus" v-for="deckpart in deckparts" v-bind:style="'color:'+deckpart.color" @click="builderDeckAdd(card[0],deckpart.id)" v-bind:title="'Add Card to '+deckpart.name+' Deck'"></div>
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
						</div>
					</div>
				</main>
				<footer>
					<p>Price data and Images from the <a href="http://yugiohprices.com/" target="_blank">yugiohprices.com</a> API</p>
					<p>Created by <a href="http://f-rilling.com/">Felix Rilling</a>. <a href="https://github.com/FelixRilling/ygodeckprice3">Repo of ygodeckprice3</a></p>
				</footer>
		</div><!-- #content -->
	</div><!-- #primary -->

	<?php colormag_sidebar_select(); ?>

	<?php do_action( 'colormag_after_body_content' ); ?>

<?php get_footer(); ?>
