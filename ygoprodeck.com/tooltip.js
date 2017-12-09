"use strict";

(function(jQuery) {
    var globalHost = "https://www.ygoprodeck.com";

    jQuery(document).ready(function() {
        //add css
        var link = jQuery("<link>"),
            setTimeoutConst;
        link.attr({
            type: "text/css",
            rel: "stylesheet",
            href: globalHost + "/tooltip.css"
        });
        jQuery("head").append(link);

        //bind hover on card-link
        jQuery(document).on(
            {
                mouseenter: function(e) {
                    if (
                        window.location.toString().includes("/card-database/")
                    ) {
                        //jQuery(this).removeAttr("href");
                    } else {
                        var name = jQuery(e.currentTarget).data("name");
                        jQuery(this).prop(
                            "href",
                            "https://ygoprodeck.com/card-database/?search=" +
                                name
                        );
                        jQuery(this).attr("target", "_blank");
                    }

                    if (jQuery(window).width() < 480) {
                        jQuery(this).removeAttr("href");
                        jQuery(this).removeAttr("target");
                    }

                    setTimeoutConst = setTimeout(function() {
                        tooltip.open(e);
                    }, 200);
                },
                mouseleave: function(e) {
                    clearTimeout(setTimeoutConst);
                    tooltip.close(e);
                }
            },
            "a[data-name]"
        );
    });

    var tooltip = {
        open: function(e) {
            var name = jQuery(e.currentTarget).data("name"),
                host = globalHost + "/pics/",
                url =
                    globalHost +
                    "/getcardid.php?name=" +
                    encodeURI(name) +
                    "&callback=?";

            console.log(url);

            tooltip.show(500, e);
            jQuery.getJSON(url, function(data) {
                var tooltip = jQuery("#yugioh-tooltip-content");
                var priceUrl =
                    "https://ygoprodeck.com/priceapp/api/prices/prices.php?n=" +
                    btoa(JSON.stringify([data.name]));

                //Load basic card data

                if (data.ban_tcg === "") {
                    data.ban_tcg = "Unlimited";
                    //jQuery('.bantcg').hide();
                    //jQuery('#bantcg').css('display', '')
                    // console.log('element hidden');
                    //    jQuery(".bantcg").addClass("hideDiv");
                    //    jQuery(".bantcg").hide();
                }

                if (
                    data.id &&
                    data.type !== "Spell Card" &&
                    data.type !== "Trap Card" &&
                    data.type !== "Link Monster"
                ) {
                    tooltip.html(
                        '<img src="' +
                            host +
                            data.id +
                            '.jpg" class="timg"><div class="timg" id="tooltiprating" style="clear:both;padding-right:45px;color: white;">' +
                            ' <i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                            data.rating_up +
                            ' <i class="fa fa-arrow-down fa-lg" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;padding-left:10px;"></i> ' +
                            data.rating_down +
                            "</div>" +
                            '<div id="yugioh-tooltip-desc">' +
                            '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.type +
                            '.jpg" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.ban_tcg +
                            '.png" style="float: right; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:2px;"/>' +
                            data.name +
                            "</div>" +
                            '<div class="atk"><img src="https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png" style="float:left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;" /> ATK : ' +
                            data.atk +
                            " DEF : " +
                            data.def +
                            "</div>" +
                            '<div class="att">' +
                            '<img src="' +
                            host +
                            data.attribute +
                            '.jpg" style="height: 20px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;">' +
                            "Attribute : " +
                            data.attribute +
                            "</div>" +
                            '<div class="type">' +
                            '<img src="' +
                            host +
                            data.race +
                            '.png" style="height: 20px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;">' +
                            "Type : " +
                            data.race +
                            "</div>" +
                            '<div class="lvl"><img src="https://ygoprodeck.com/wp-content/uploads/2017/01/level.png" style="float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/> Level/Rank: ' +
                            data.level +
                            "</div>" +
                            //   '<div class="bantcg" style="display:block;"><img src="https://ygoprodeck.com/pics/icons/' + data.ban_tcg + '.png" style="float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/>TCG: ' + data.ban_tcg + '</div>' +

                            '<div class="text">' +
                            data.desc +
                            "</div>" +
                            "</div>"
                    );
                } else if (data.id && data.type == "Link Monster") {
                    tooltip.html(
                        '<img src="' +
                            host +
                            data.id +
                            '.jpg" class="timg"><div class="timg" id="tooltiprating" style="clear:both;padding-right:45px;color: white;">' +
                            ' <i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                            data.rating_up +
                            ' <i class="fa fa-arrow-down fa-lg" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;padding-left:10px;"></i> ' +
                            data.rating_down +
                            "</div>" +
                            '<div id="yugioh-tooltip-desc">' +
                            '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.type +
                            '.jpg" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.ban_tcg +
                            '.png" style="float: right; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:2px;"/>' +
                            data.name +
                            "</div>" +
                            '<div class="atk"><img src="https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png" style="float:left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/> ATK : ' +
                            data.atk +
                            " LINK : " +
                            data.linkval +
                            "</div>" +
                            '<div class="att">' +
                            '<img src="' +
                            host +
                            data.attribute +
                            '.jpg" style="height: 20px; width: 20px; float: left; padding-right: 5px display: inline-block; vertical-align:top; margin:0;;">' +
                            "Attribute : " +
                            data.attribute +
                            "</div>" +
                            '<div class="type">' +
                            '<img src="' +
                            host +
                            data.race +
                            '.png" style="height: 20px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;">' +
                            "Type : " +
                            data.race +
                            "</div>" +
                            '<div class="lvl"><img src="https://ygoprodeck.com/wp-content/uploads/2017/02/link.png" style="float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/> Link Arrows: ' +
                            data.linkmarkers +
                            "</div>" +
                            '<div class="text">' +
                            data.desc +
                            "</div>" +
                            "</div>"
                    );
                } else if (data.name == undefined) {
                    tooltip.html(
                        '<img src="https://ygoprodeck.com/pics/Tooltip%20Error.jpg" class="timg">' +
                            '<div id="yugioh-tooltip-desc">' +
                            '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.type +
                            '.jpg" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;">Card Not Found</div>' +
                            '<div class="text">Card information could not be found. This could be due to an issue with the card name having strange characters such as & symbols. It could also be due to a card ID not being known in our Database. We will strive to fix the error as soon as possible.</div>' +
                            "</div>"
                    );
                } else {
                    tooltip.html(
                        '<img src="' +
                            host +
                            data.id +
                            '.jpg" class="timg"><div class="timg" id="tooltiprating" style="clear:both;padding-right:45px;color: white;">' +
                            ' <i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                            data.rating_up +
                            ' <i class="fa fa-arrow-down fa-lg" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;padding-left:10px;"></i> ' +
                            data.rating_down +
                            "</div>" +
                            '<div id="yugioh-tooltip-desc">' +
                            '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.type +
                            '.jpg" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"><img src="https://ygoprodeck.com/pics/icons/' +
                            data.ban_tcg +
                            '.png" style="float: right; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:2px;"/>' +
                            data.name +
                            "</div>" +
                            '<div class="text">' +
                            data.desc +
                            "</div>" +
                            "</div>"
                    );
                }

                //Load price data
                console.log(priceUrl);
                jQuery.getJSON(priceUrl, function(priceResponse) {
                    var priceData = priceResponse[0];

                    if (priceData) {
                        console.log(priceData);

                        jQuery("#yugioh-tooltip-desc", tooltip).append(
                            '<div class="price">' +
                                'Price: <ul><li>Low:<span style="color:#caf9ae;">' +
                                transformPrice(priceData[0]) +
                                '</span>    Average:<span style="color:#fff6a1;">' +
                                transformPrice(priceData[1]) +
                                "</span>" +
                                '</span>    High:<span style="color:#fdc1b0;">' +
                                transformPrice(priceData[2]) +
                                "</span></li>" +
                                "</ul>" +
                                "</div>"
                        );
                    }

                    function transformPrice(val) {
                        return val.toFixed(2) + "$";
                    }
                });
            });
        },
        show: function(size, e) {
            jQuery("#yugioh-tooltip").remove();
            jQuery("body").append(
                '<div id="yugioh-tooltip" class="card-tooltip"><div id="yugioh-tooltip-content"></div></div>'
            );

            var position = {
                left: function() {
                    if (e.pageX > jQuery("body").width() / 2) {
                        return e.pageX - size - 50;
                    } else {
                        return e.pageX + 30;
                    }
                },
                top: e.pageY + 30
            };

            jQuery("#yugioh-tooltip")
                .css({
                    left: position.left,
                    top: position.top
                })
                .stop(true, true)
                .fadeIn(400);
            var height = 260,
                offsetTop = jQuery("#yugioh-tooltip").offset().top,
                scrolltop = jQuery(window).scrollTop(),
                windowHeight = window.innerHeight,
                yPos = height + offsetTop - scrolltop - windowHeight;
            if (yPos > -30) {
                jQuery("#yugioh-tooltip").css({
                    top: e.pageY - Math.max(0, yPos) - 20
                });
            }
        },
        close: function() {
            jQuery(".card-tooltip").remove();
        }
    };
    window.a = tooltip;
})(jQuery);
