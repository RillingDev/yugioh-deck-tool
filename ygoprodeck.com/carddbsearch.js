var autocompleteDataStorage = [];

jQuery(function() {
    //jQuery("#search-box-input").focus();
    jQuery("#search-box-input").autocomplete({
        source: "https://ygoprodeck.com/carddbsearch.php",
        minLength: 3,
        response: function(event, ui) {
            autocompleteDataStorage = ui.content;
        },
        open: function() {
            var $autocompleteItems = jQuery("#ui-id-1 li");
            $autocompleteItems.each(function(index) {
                var $currentItem = jQuery("div", this);
                var currentItemData = autocompleteDataStorage[index];
                var $typeImg = jQuery(
                    "<img class='attributeimg' src='https://ygoprodeck.com/pics/icons/" +
                        currentItemData.type +
                        ".jpg'>"
                );

                console.log($currentItem, currentItemData);
                $currentItem.append($typeImg);
            });
        },
        select: function(event, ui) {
            var id = ui.item.id;
            jQuery("#resultbox-content").html('<div class="loader"></div>');
            getcardbyid(id);

            jQuery.getJSON(
                "https://ygoprodeck.com/getcardbyid.php?cardid=" +
                    id +
                    "&callback=?",
                function(data) {
                    var idname = data.name;

                    if (
                        window.location.toString().includes("/card-database/")
                    ) {
                        var stateObj = "?search=" + idname;
                        history.replaceState(
                            stateObj,
                            "Yu-Gi-Oh! Card Database - YGOPRODECK",
                            stateObj
                        );
                    }
                }
            );
        }
    });
});

jQuery(function() {
    //jQuery("#search-box-input-deckbuilder").focus();
    jQuery("#search-box-input-deckbuilder").autocomplete({
        source: "https://ygoprodeck.com/carddbsearch.php",
        minLength: 3,
        select: function(event, ui) {
            var id = ui.item.id;

            jQuery("#btnaddtodeck").prop("data-card", ui.item.label);
            jQuery("#btnaddtodeck").prop("data-cardid", ui.item.id);

            sortUnorderedList("mainlist");
            sortUnorderedList("extralist");
            //set_cookie("maindeck", ui.item.label,24);

            // getcardbyid(id);
        }
    });
});

jQuery(document).ready(function() {
    getrandomcards();

    if (top.location.pathname === "/card-database/") {
    }

    if (document.location.pathname.indexOf("/duel-links/") === 0) {
        getUltimateRisingURSet();
        getUltimateRisingSRSet();
        getUltimateRisingRSet();
        getUltimateRisingNSet();
        getAoDURSet();
        getAoDSRSet();
        getAoDRSet();
        getAoDNSet();
        getNeoURSet();
        getNeoSRSet();
        getNeoRSet();
        getNeoNSet();
        getTyrantURSet();
        getTyrantSRSet();
        getTyrantRSet();
        getTyrantNSet();

        getYugiSet();
        getKaibaSet();
        getJoeySet();
        getMaiSet();
        getWeevilSet();
        getRexSet();
        getMakoSet();
        getTeaSet();
        getKeithSet();
        getIshizuSet();
        getOdionSet();
        getPegasusSet();
    }

    if (document.location.pathname.indexOf("/top-10-cards-week/") === 0) {
        get10Topcards();
    }

    /*
	jQuery('#randomcards-content').on('scroll', function () {
		if (jQuery(this).scrollTop() + jQuery(this).innerHeight() >= jQuery(this)[0].scrollHeight) {

			getrandomcards();
			getlatestcards();
			getlatest25cards();
			getUltimateRisingURSet();
			getUltimateRisingSRSet();
			getUltimateRisingRSet();
			getUltimateRisingNSet();
			getAoDURSet();
			getAoDSRSet();
			getAoDRSet();
			getAoDNSet();
			getNeoURSet();
			getNeoSRSet();
			getNeoRSet();
			getNeoNSet();
			getTyrantURSet();
			getTyrantSRSet();
			getTyrantRSet();
			getTyrantNSet();

			getYugiSet();
			getKaibaSet();
			getJoeySet();
			getMaiSet();
			getWeevilSet();
			getRexSet();
			getMakoSet();
			getTeaSet();
			getKeithSet();
			getIshizuSet();
			getOdionSet();
			getPegasusSet();

		}
	});
*/
    if (window.location.href.indexOf("uilder") > -1) {
        jQuery.ajax({
            url: "../../miscf.php?vdeck=true",
            dataType: "json",
            success: function(data) {
                jQuery("#main-deck").html(data[0].m_html);
                jQuery("#extra-deck").html(data[0].e_html);

                sortUnorderedList("mainlist");
                sortUnorderedList("extralist");
            },
            type: "GET"
        });
    }

    jQuery("#btnaddtodeck").click(function() {
        id = jQuery("#btnaddtodeck").prop("data-cardid");
        lbl = jQuery("#btnaddtodeck").prop("data-card");

        /*jQuery.getJSON('https://www.ygoprodeck.com/addtodeck.php?cardid=' + id + '&callback=?',
                function (data) {
                	host = "https://www.ygoprodeck.com/pics/";
                     jQuery('#main-deck').html(data.m_html);
                });*/

        jQuery.ajax({
            url: "../../addtodeck.php?cardid=" + id,
            dataType: "json",
            success: function(data) {
                jQuery("#main-deck").html(data[0].m_html);
                jQuery("#extra-deck").html(data[0].e_html);

                sortUnorderedList("mainlist");
                sortUnorderedList("extralist");
            },
            type: "GET"
        });
    });

    jQuery("#btnaddrandomtodeck").click(function() {
        jQuery.ajax({
            url: "../../addtodeck.php",
            dataType: "json",
            success: function(data) {
                jQuery("#main-deck").html(data[0].m_html);
                jQuery("#extra-deck").html(data[0].e_html);

                sortUnorderedList("mainlist");
                sortUnorderedList("extralist");
            },
            type: "GET"
        });
    });

    jQuery("#btnexportdek").click(function() {
        jQuery.ajax({
            url: "../../miscf.php?check=isready",
            dataType: "json",
            success: function(data) {
                if (data.status == "true") {
                    url = "../../miscf.php?export=true";
                    window.open(
                        url,
                        "_blank" // <- This is what makes it open in a new window.
                    );
                } else {
                    alert("your deck is not ready.");
                }
            },
            type: "GET"
        });
    });

    jQuery("#btnresetdek").click(function() {
        var r = confirm("Are you sure to reset the deck ?");
        if (r == true) {
            jQuery.ajax({
                url: "../../miscf.php?resetdeck=true",
                dataType: "json",
                success: function(data) {
                    jQuery.ajax({
                        url: "../../miscf.php?vdeck=true",
                        dataType: "json",
                        success: function(data) {
                            jQuery("#main-deck").html(data[0].m_html);
                            jQuery("#extra-deck").html(data[0].e_html);
                        },
                        type: "GET"
                    });
                },
                type: "GET"
            });
        } else {
            return false;
        }
    });
});

function showdecks() {
    alert("a");
}

function set_cookie(cookiename, cookievalue, hours) {
    var date = new Date();
    date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
    document.cookie =
        cookiename +
        "=" +
        cookievalue +
        "; path=/;expires = " +
        date.toGMTString();
}

function ReplaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n = yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
}

function getcardbyid(id) {
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getcardbyid.php?cardid=" +
            id +
            "&callback=?",
        function(data) {
            var similarname = data.name;
            var priceUrl =
                "https://ygoprodeck.com/priceapp/api/prices/prices.php?n=" +
                btoa(JSON.stringify([data.name]));
            host = "https://www.ygoprodeck.com/pics/";

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
                jQuery("#resultbox-content").html(
                    '<div id="db-img"><img src="' +
                        host +
                        data.id +
                        '.jpg"><br><div id="votes" style="background-color: rgba(220,220,220,0.5);border-radius: 10px;width: 79%;height: 100%;align-content: center;margin-left: 20px;background-color: rgba(220,220,220,0.5);box-shadow: 0 0 2px 0 black;border-radius: 2px;"><a href="javascript:void(0);" id="u' +
                        id +
                        '" onclick="voteup(this)" class="up-arrow" style="margin-right:10px;"><i class="fa fa-arrow-up" aria-hidden="true" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                        data.upcount +
                        '</a>  <a href="javascript:void(0);" id="d' +
                        id +
                        '" onclick="votedown(this)" class="down-arrow"><i class="fa fa-arrow-down" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;"></i> ' +
                        data.downcount +
                        "</a></div></div>" +
                        '<div id="card-desc">' +
                        '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                        data.ban_tcg +
                        '.png" style="float: right; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:2px;"/>' +
                        data.name +
                        "</div>" +
                        '<div class="atk"><i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #2e3033;float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:5px;"></i> Card Views : ' +
                        ReplaceNumberWithCommas(data.times) +
                        ' <i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #2e3033;padding-right: 1px; display: inline-block; vertical-align:top; margin:0;margin-top:5px;margin-left:10px;"></i> This Week : ' +
                        ReplaceNumberWithCommas(data.timesperweek) +
                        "</div>" +
                        '<div class="atk"><img src="https://ygoprodeck.com/pics/icons/' +
                        data.type +
                        '.jpg" alt="' +
                        data.type +
                        '" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"> ' +
                        data.type +
                        " / ID: " +
                        data.id +
                        "</div>" +
                        '<div class="atk"><img src="https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png" style="float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/> ATK : ' +
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
                        '<div class="text">' +
                        data.desc +
                        "</div>" +
                        "</div>"
                );
            } else if (data.id && data.type == "Link Monster") {
                jQuery("#resultbox-content").html(
                    '<div id="db-img"><img src="' +
                        host +
                        data.id +
                        '.jpg"><br><div id="votes" style="background-color: rgba(220,220,220,0.5);border-radius: 10px;width: 79%;height: 100%;align-content: center;margin-left: 20px;background-color: rgba(220,220,220,0.5);box-shadow: 0 0 2px 0 black;border-radius: 2px;"><a href="javascript:void(0);" id="u' +
                        id +
                        '" onclick="voteup(this)" class="up-arrow" style="margin-right:10px;"><i class="fa fa-arrow-up" aria-hidden="true" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                        data.upcount +
                        '</a>  <a href="javascript:void(0);" id="d' +
                        id +
                        '" onclick="votedown(this)" class="down-arrow"><i class="fa fa-arrow-down" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;"></i> ' +
                        data.downcount +
                        "</a></div></div>" +
                        '<div id="card-desc">' +
                        '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                        data.ban_tcg +
                        '.png" style="float: right; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:2px;"/>' +
                        data.name +
                        "</div>" +
                        '<div class="atk"><i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #2e3033;float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:5px;"></i> Card Views : ' +
                        ReplaceNumberWithCommas(data.times) +
                        ' <i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #2e3033;padding-right: 1px; display: inline-block; vertical-align:top; margin:0;margin-top:5px;margin-left:10px;"></i> This Week : ' +
                        ReplaceNumberWithCommas(data.timesperweek) +
                        "</div>" +
                        '<div class="atk"><img src="https://ygoprodeck.com/pics/icons/' +
                        data.type +
                        '.jpg" alt="' +
                        data.type +
                        '" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"> ' +
                        data.type +
                        " / ID: " +
                        data.id +
                        "</div>" +
                        '<div class="atk"><img src="https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png" style="float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/> ATK : ' +
                        data.atk +
                        " LINK : " +
                        data.linkval +
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
                        '<div class="lvl"><img src="https://ygoprodeck.com/wp-content/uploads/2017/02/link.png" style="float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"/> Link Markers: ' +
                        data.linkmarkers +
                        "</div>" +
                        '<div class="text">' +
                        data.desc +
                        "</div>" +
                        "</div>"
                );
            } else if (data.name == undefined) {
                jQuery("#resultbox-content").html(
                    '<div id="db-img"><img src="https://ygoprodeck.com/pics/Tooltip%20Error.jpg"><br></div>' +
                        '<div id="card-desc">' +
                        '<div class="name">Card Not Found</div>' +
                        '<div class="text">Card information could not be found. You may have accidentally mis-typed the card name which then returned invalid results.</div>' +
                        "</div>"
                );
            } else {
                jQuery("#resultbox-content").html(
                    '<div id="db-img"><img src="' +
                        host +
                        data.id +
                        '.jpg"><br><div id="votes" style="background-color: rgba(220,220,220,0.5);border-radius: 10px;width: 79%;height: 100%;align-content: center;margin-left: 20px;background-color: rgba(220,220,220,0.5);box-shadow: 0 0 2px 0 black;border-radius: 2px;"><a href="javascript:void(0);" id="u' +
                        id +
                        '" onclick="voteup(this)" class="up-arrow" style="margin-right:10px;"><i class="fa fa-arrow-up" aria-hidden="true" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                        data.upcount +
                        '</a>  <a href="javascript:void(0);" id="d' +
                        id +
                        '" onclick="votedown(this)" class="down-arrow"><i class="fa fa-arrow-down" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;"></i> ' +
                        data.downcount +
                        "</a></div></div>" +
                        '<div id="card-desc">' +
                        '<div class="name"><img src="https://ygoprodeck.com/pics/icons/' +
                        data.ban_tcg +
                        '.png" style="float: right; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:2px;"/>' +
                        data.name +
                        "</div>" +
                        '<div class="atk"><i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #2e3033;float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;margin-top:5px;"></i> Card Views : ' +
                        ReplaceNumberWithCommas(data.times) +
                        ' <i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #2e3033;padding-right: 1px; display: inline-block; vertical-align:top; margin:0;margin-top:5px;margin-left:10px;"></i> This Week : ' +
                        ReplaceNumberWithCommas(data.timesperweek) +
                        "</div>" +
                        '<div class="atk"><img src="https://ygoprodeck.com/pics/icons/' +
                        data.type +
                        '.jpg" alt="' +
                        data.type +
                        '" style="height: 25px; width: 20px; float: left; padding-right: 5px; display: inline-block; vertical-align:top; margin:0;"> ' +
                        data.type +
                        " / ID: " +
                        data.id +
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

                    jQuery("#card-desc").append(
                        '<div class="price">' +
                            '<a href="https://yugiohprices.com/card_price?name=' +
                            data.name +
                            '" target="_blank" style="color: #2e3033;"><i class="fa fa-usd fa-lg" aria-hidden="true" title="Yu-Gi-Oh! Prices" alt="Yu-Gi-Oh! Prices" style="color: #2e3033;margin-right:5px;"></i>Yu-Gi-Oh! Prices</a> <ul><li>Low: <span style="color:#caf9ae;">' +
                            transformPrice(priceData[0]) +
                            '</span>    Average: <span style="color:#fff6a1;">' +
                            transformPrice(priceData[1]) +
                            "</span>" +
                            '</span>    High: <span style="color:#fdc1b0;">' +
                            transformPrice(priceData[2]) +
                            "</span></li>" +
                            "</ul>" +
                            "</div>"
                    );
                }

                function transformPrice(val) {
                    return val.toFixed(2) + "$";
                }

                //Card Tips Append
                jQuery("#card-desc").append(
                    '<fieldset class="fieldsetdiv"><legend class="legenddiv">Card Tips</legend><div class="content ">' +
                        data.content +
                        "</div></fieldset>"
                );

                //Card Trivia Append
                jQuery("#card-desc").append(
                    '<fieldset class="fieldsetdiv"><legend class="legenddiv">Card Trivia</legend><div class="content ">' +
                        data.content2 +
                        "</div></fieldset>"
                );

                jQuery(".legenddiv").click(function() {
                    //jQuery(".content").toggle();
                    jQuery(".content")
                        .delay(250)
                        .fadeToggle();
                });

                if (jQuery(".noarticletext").length) {
                    jQuery(".noarticletext").hide();
                    jQuery(".fieldsetdiv").hide();
                } else if (jQuery(".cardtable-header").length) {
                    jQuery(".fieldsetdiv").hide();
                    jQuery(".cardtable-header").hide();
                }
                setTimeout(function() {
                    jQuery(".navbox").hide();
                    //jQuery('h2').nextAll('ul').remove();

                    jQuery("#mw-content-text ul li a").attr(
                        "onclick",
                        "javascript:void(0);"
                    );
                    jQuery("#mw-content-text tr td a").attr(
                        "href",
                        "javascript:void(0);"
                    );
                    jQuery("#mw-content-text th a").attr(
                        "href",
                        "javascript:void(0);"
                    );
                }, 1000);

                jQuery(".navbox").hide();
                //jQuery('h2').nextAll('ul').remove();

                jQuery("#mw-content-text ul li a").attr(
                    "href",
                    "javascript:void(0);"
                );
                jQuery("#mw-content-text tr td a").attr(
                    "href",
                    "javascript:void(0);"
                );
                jQuery("#mw-content-text th a").attr(
                    "href",
                    "javascript:void(0);"
                );
            });

            /*
									jQuery.getJSON('https://www.ygoprodeck.com/similarcards.php?name=' + similarname + '&callback=?',
	                     	function (values) {
	                     	    if(values.name != undefined && values.id != data.id){

		                             jQuery("#card-desc").append(



		                                 '<fieldset class="fieldsetdiv" style="margin-top:0px;"><legend class="legenddiv">Similar Cards</legend>'+
                                         '<div class="content "><a data-name="'+values.name+'" style="color:#2e3033;" onclick="mainsearch('+values.id+')"><img src="https://ygoprodeck.com/pics/'+values.id+'.jpg" style="height:130px;width:97px;margin-top:30px;"></a>' +
		                                 '</div></fieldset>'

	                     	                 )
	                     	    }
	                         	});
	                         	*/

            //End of 1st Json Request
        }
    );
}

function mainsearch(cardid) {
    if (jQuery(window).width() < 480) {
    } else {
        jQuery("html, body").animate(
            {
                scrollTop: jQuery("#content").offset().top - 20 //#DIV_ID is an example. Use the id of your destination on the page
            },
            1000
        );

        //jQuery("#search-box-input").val(searchname);
        jQuery("#resultbox-content").html('<div class="loader"></div>');
        jQuery.getJSON(
            "https://ygoprodeck.com/getcardbyid.php?cardid=" +
                cardid +
                "&callback=?",
            function(data) {
                var idname = data.name;
                var cid = data.id;
                jQuery("#search-box-input").val(idname);
                getcardbyid(cid);

                var stateObj = "?search=" + idname;
                history.replaceState(
                    stateObj,
                    "Yu-Gi-Oh! Card Database - YGOPRODECK",
                    stateObj
                );
            }
        );
    }
}

function getrandomcards() {
    jQuery("#randomcards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getrandomcards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '" href="https://ygoprodeck.com/card-database/?search=' +
                        val.name +
                        '" target="_blank"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '" href="https://ygoprodeck.com/card-database/?search=' +
                        val.name +
                        '" target="_blank"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#randomcards-content").html(htmlst);
        }
    );
}

function getlatestcards() {
    jQuery("#latestcards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getlatestcards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption><p>&nbsp;</p></figure>';
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption><p>&nbsp;</p></figure>';
                }
            });
            jQuery("#latestcards-content").html(htmlst);
        }
    );
}

function get10Topcards() {
    jQuery("#top10cards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/get10topcards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";
            var counter = 0;

            htmlst += '<ul class="top10ul">';

            jQuery.each(data, function(i, val) {
                counter++;

                //    var priceUrl = "https://ygoprodeck.com/priceapp/api/prices/prices.php?n=" + btoa(JSON.stringify([val.name]));

                //Load price data
                //    console.log(priceUrl);
                //
                //     jQuery.getJSON(priceUrl,
                //     function(priceResponse) {
                //      var priceData = priceResponse[0];

                //       function transformPrice(val) {
                //           return val.toFixed(2) + "$";
                //      }

                //window.alert(transformPrice(priceData.high));
                //      window.test123 = transformPrice(priceData.high);

                //   });

                //  window.alert(window.test123);

                htmlst +=
                    '<li><figure style="display: flex;align-items: center;text-align: inherit;"><a data-name="' +
                    val.name +
                    '"><img src="' +
                    host +
                    val.id +
                    '.jpg"></a><figcaption><p class="topname">' +
                    counter +
                    '. <a href="/card-database/?card=' +
                    val.name +
                    '" target="_blank">' +
                    val.name +
                    '</a></p><p class="topdesc"><i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched This Week" alt="Times Searched This Week" style="color: #0d0d0d;"></i> This Week: ' +
                    ReplaceNumberWithCommas(val.timesperweek) +
                    '</p><p class="topdesc"><i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #0d0d0d;"></i> All Time: ' +
                    ReplaceNumberWithCommas(val.times) +
                    '</p><p class="topdesc"><i class="fa fa-usd fa-lg" aria-hidden="true" title="Yu-Gi-Oh! Prices" alt="Yu-Gi-Oh! Prices" style="color: #0d0d0d;"></i>&nbsp; <a href="https://yugiohprices.com/card_price?name=' +
                    val.name +
                    '" target="_blank">Yu-Gi-Oh! Prices</a></p></figcaption></figure></li><hr>';
            });
            htmlst += "</ul>";
            jQuery("#top10cards-content").html(htmlst);
        }
    );
}

function ReplaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n = yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
}

function getlatest25cards() {
    jQuery("#latest25cards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getlatest25cards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#latest25cards-content").html(htmlst);
        }
    );
}

function get5Popcards() {
    jQuery("#popcards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/get5Popcards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<img src="https://ygoprodeck.com/wp-content/uploads/2017/03/search_symbol_small2.png" alt="Times Searched" title="Times Searched" style="height: 15px !important; width: 15px !important;"/>' +
                        val.times +
                        "</figcaption></figure>";
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<img src="https://ygoprodeck.com/wp-content/uploads/2017/03/search_symbol_small2.png" alt="Times Searched" title="Times Searched" style="height: 15px !important; width: 15px !important;"/>' +
                        val.times +
                        "</figcaption></figure>";
                }
            });
            jQuery("#popcards-content").html(htmlst);
        }
    );
}

function getpop25cards() {
    jQuery("#pop25cards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getpop25cards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #0d0d0d;line-height: 0.75em;"></i> ' +
                        val.times +
                        "</figcaption></figure>";
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-search fa-lg" aria-hidden="true" title="Times Searched" alt="Times Searched" style="color: #0d0d0d;line-height: 0.75em;"></i> ' +
                        val.times +
                        "</figcaption></figure>";
                }
            });
            jQuery("#pop25cards-content").html(htmlst);
        }
    );
}

function get5TopVotecards() {
    jQuery("#topvotecards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/get5TopVotecards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvotes" alt="Upvotes" style="color: #FF8b60;line-height: 0.75em;"></i> ' +
                        val.rating_up +
                        "</figcaption></figure>";
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvotes" alt="Upvotes" style="color: #FF8b60;line-height: 0.75em;"></i> ' +
                        val.rating_up +
                        "</figcaption></figure>";
                }
            });
            jQuery("#topvotecards-content").html(htmlst);
        }
    );
}

function get25TopVotecards() {
    jQuery("#top25votecards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/get25TopVotecards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvotes" alt="Upvotes" style="color: #FF8b60;line-height: 0.75em;"></i> ' +
                        val.rating_up +
                        "</figcaption></figure>";
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-arrow-up fa-lg" aria-hidden="true" title="Upvotes" alt="Upvotes" style="color: #FF8b60;line-height: 0.75em;"></i> ' +
                        val.rating_up +
                        "</figcaption></figure>";
                }
            });
            jQuery("#top25votecards-content").html(htmlst);
        }
    );
}

function get5DownVotecards() {
    jQuery("#downvotecards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/get5DownVotecards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<img src="https://ygoprodeck.com/wp-content/uploads/2017/03/vote_down_symbol.png" alt="Downvotes" title="Downvotes" style="height: 15px !important; width: 15px !important;"/>' +
                        val.rating_down +
                        "</figcaption></figure>";
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<img src="https://ygoprodeck.com/wp-content/uploads/2017/03/vote_down_symbol.png" alt="Downvotes" title="Downvotes" style="height: 15px !important; width: 15px !important;"/>' +
                        val.rating_down +
                        "</figcaption></figure>";
                }
            });
            jQuery("#downvotecards-content").html(htmlst);
        }
    );
}

function get25DownVotecards() {
    jQuery("#down25votecards-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/get25DownVotecards.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-arrow-down fa-lg" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;line-height: 0.75em;"></i> ' +
                        val.rating_down +
                        "</figcaption></figure>";
                } else {
                    htmlst +=
                        '<figure><a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a><figcaption>' +
                        '<i class="fa fa-arrow-down fa-lg" aria-hidden="true" title="Downvote" alt="Downvote" style="color: #9494FF;line-height: 0.75em;"></i> ' +
                        val.rating_down +
                        "</figcaption></figure>";
                }
            });
            jQuery("#down25votecards-content").html(htmlst);
        }
    );
}

function getUltimateRisingURSet() {
    jQuery("#ultimaterising-ur-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getUltimateRisingURSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#ultimaterising-ur-content").html(htmlst);
        }
    );
}
function getUltimateRisingSRSet() {
    jQuery("#ultimaterising-sr-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getUltimateRisingSRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#ultimaterising-sr-content").html(htmlst);
        }
    );
}
function getUltimateRisingRSet() {
    jQuery("#ultimaterising-r-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getUltimateRisingRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#ultimaterising-r-content").html(htmlst);
        }
    );
}
function getUltimateRisingNSet() {
    jQuery("#ultimaterising-n-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getUltimateRisingNSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#ultimaterising-n-content").html(htmlst);
        }
    );
}

function getAoDURSet() {
    jQuery("#aod-ur-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getAoDURSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#aod-ur-content").html(htmlst);
        }
    );
}
function getAoDSRSet() {
    jQuery("#aod-sr-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getAoDSRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#aod-sr-content").html(htmlst);
        }
    );
}
function getAoDRSet() {
    jQuery("#aod-r-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getAoDRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#aod-r-content").html(htmlst);
        }
    );
}
function getAoDNSet() {
    jQuery("#aod-n-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getAoDNSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#aod-n-content").html(htmlst);
        }
    );
}

function getNeoURSet() {
    jQuery("#neo-ur-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getNeoURSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#neo-ur-content").html(htmlst);
        }
    );
}
function getNeoSRSet() {
    jQuery("#neo-sr-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getNeoSRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#neo-sr-content").html(htmlst);
        }
    );
}
function getNeoRSet() {
    jQuery("#neo-r-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getNeoRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#neo-r-content").html(htmlst);
        }
    );
}
function getNeoNSet() {
    jQuery("#neo-n-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getNeoNSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#neo-n-content").html(htmlst);
        }
    );
}

function getTyrantURSet() {
    jQuery("#tyrant-ur-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getTyrantURSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#tyrant-ur-content").html(htmlst);
        }
    );
}
function getTyrantSRSet() {
    jQuery("#tyrant-sr-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getTyrantSRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#tyrant-sr-content").html(htmlst);
        }
    );
}
function getTyrantRSet() {
    jQuery("#tyrant-r-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getTyrantRSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#tyrant-r-content").html(htmlst);
        }
    );
}
function getTyrantNSet() {
    jQuery("#tyrant-n-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getTyrantNSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#tyrant-n-content").html(htmlst);
        }
    );
}

function getYugiSet() {
    jQuery("#yugi-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getYugiSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#yugi-content").html(htmlst);
        }
    );
}

function getKaibaSet() {
    jQuery("#kaiba-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getKaibaSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#kaiba-content").html(htmlst);
        }
    );
}

function getJoeySet() {
    jQuery("#joey-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getJoeySet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#joey-content").html(htmlst);
        }
    );
}

function getTeaSet() {
    jQuery("#tea-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getTeaSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#tea-content").html(htmlst);
        }
    );
}

function getMaiSet() {
    jQuery("#mai-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getMaiSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#mai-content").html(htmlst);
        }
    );
}

function getWeevilSet() {
    jQuery("#weevil-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getWeevilSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#weevil-content").html(htmlst);
        }
    );
}

function getRexSet() {
    jQuery("#rex-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getRexSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#rex-content").html(htmlst);
        }
    );
}

function getMakoSet() {
    jQuery("#mako-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getMakoSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#mako-content").html(htmlst);
        }
    );
}

function getIshizuSet() {
    jQuery("#ishizu-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getIshizuSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#ishizu-content").html(htmlst);
        }
    );
}

function getOdionSet() {
    jQuery("#odion-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getOdionSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#odion-content").html(htmlst);
        }
    );
}

function getKeithSet() {
    jQuery("#keith-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getKeithSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#keith-content").html(htmlst);
        }
    );
}

function getPegasusSet() {
    jQuery("#pegasus-content").html('<div class="loader"></div>');
    var htmlst = "";
    jQuery.getJSON(
        "https://www.ygoprodeck.com/getPegasusSet.php?callback=?",
        function(data) {
            host = "https://www.ygoprodeck.com/pics/";

            jQuery.each(data, function(i, val) {
                if (
                    val.id &&
                    val.type !== "Spell Card" &&
                    val.type !== "Trap Card"
                ) {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                } else {
                    htmlst +=
                        '<a data-name="' +
                        val.name +
                        '"><img src="' +
                        host +
                        val.id +
                        '.jpg"></a>';
                }
            });
            jQuery("#pegasus-content").html(htmlst);
        }
    );
}

function rmcrd(id) {
    jQuery.ajax({
        url: "../../miscf.php?rmcrd=" + id,
        dataType: "json",
        success: function(data) {
            jQuery("#main-deck").html(data[0].m_html);
            jQuery("#extra-deck").html(data[0].e_html);
        },
        type: "GET"
    });
}

function sortUnorderedList(ul, sortDescending) {
    if (typeof ul == "string") ul = document.getElementById(ul);

    if (!ul) {
        return;
    }

    // Get the list items and setup an array for sorting
    var lis = ul.getElementsByTagName("LI");
    var vals = [];

    // Populate the array
    for (var i = 0, l = lis.length; i < l; i++) vals.push(lis[i].innerHTML);

    // Sort it
    vals.sort();

    // Sometimes you gotta DESC
    if (sortDescending) vals.reverse();

    // Change the list on the page
    for (var i = 0, l = lis.length; i < l; i++) lis[i].innerHTML = vals[i];
}

function voteup(elem) {
    cardid = elem.id;
    jQuery.getJSON(
        "https://www.ygoprodeck.com/setvoting.php?cid=" +
            cardid +
            "&vote=up&callback=?",
        function(data) {
            //alert(data);
            jQuery("#" + elem.id).html(
                '<i class="fa fa-arrow-up" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                    data.upcount
            );
        }
    );
}
function voteuplist(elem) {
    cardid = elem.id;
    jQuery.getJSON(
        "https://www.ygoprodeck.com/setvoting.php?cid=" +
            cardid +
            "&vote=up&callback=?",
        function(data) {
            //alert(data);
            jQuery("#" + elem.id).html(
                '<i class="fa fa-arrow-up fa-lg" title="Upvote" alt="Upvote" style="color: #FF8b60;"></i> ' +
                    data.upcount
            );
        }
    );
}
function votedown(elem) {
    cardid = elem.id;
    jQuery.getJSON(
        "https://www.ygoprodeck.com/setvoting.php?cid=" +
            cardid +
            "&vote=down&callback=?",
        function(data) {
            //alert(data);
            jQuery("#" + elem.id).html(
                '<i class="fa fa-arrow-down" title="Downvote" alt="Downvote" style="color: #9494FF;"></i> ' +
                    data.downcount
            );
        }
    );
}
function votedownlist(elem) {
    cardid = elem.id;
    jQuery.getJSON(
        "https://www.ygoprodeck.com/setvoting.php?cid=" +
            cardid +
            "&vote=down&callback=?",
        function(data) {
            //alert(data);
            jQuery("#" + elem.id).html(
                '<i class="fa fa-arrow-down fa-lg" title="Downvote" alt="Downvote" style="color: #9494FF;"></i> ' +
                    data.downcount
            );
        }
    );
}

if (navigator.appVersion.indexOf("Chrome/") != -1) {
    document.write(
        "<style>.ui-autocomplete .ui-menu-item .ui-menu-item-wrapper{ margin-top:-20px;}</style>"
    );
}
