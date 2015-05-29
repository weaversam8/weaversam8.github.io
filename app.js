$(document).ready(function() {
    //document ready

    // throw Error('hi');

    //hide everything in the foreground to prepare for reveal
    $('#frontground').children().each(function(){
        $(this).hide();
    });

    var spanIdList = [];

    //first, get each paragraph element
    $('#frontground').find('p').each(function(elementIndex) {
        var el = $(this);

        // var text = el.text().trim();
        var text = el.contents()
            .filter(function() {
                return this.nodeType == Node.TEXT_NODE;
            }).text();
        console.log(text);

        //split into x character bits
        var bitSize = 5;

        var regex = new RegExp('.{1,' + bitSize + '}', 'g');
        var arr = text.match(regex);

        el.contents()
        .filter(function() {
            return this.nodeType == Node.TEXT_NODE;
        }).remove();
        for (index in arr) {
            var id = 'text_' + elementIndex + '_' + index;
            console.log(id);
            el.append($('<span></span>').attr('id', id).addClass('hidden-p').attr('style', 'display:none;').text(arr[index]));
            spanIdList.push(id);
        }
    });

    //generate list of valid keys
    var keys = "abcdefghijklnopqrstuvwxyz".split('');

    var cursor = $('<span></span>').html('|').addClass('blinking-cursor').attr('id', 'cursor');

    var currentIndex = 0;
    var frontFaded = false;

    Mousetrap.bind(keys, function(e) {
        if (!frontFaded) {
            frontFaded = true;
            $('#frontground').removeClass('faded');
            $('#frontground').addClass('barely-faded');
            //finally, unhide the frontground
            $('#frontground').fadeIn();
            $('#background').fadeOut();
        }
        console.log(currentIndex);
        $('#cursor').remove();
        var currentSpan = $('#'+spanIdList[currentIndex]);
        currentSpan.append(cursor).fadeIn();
        //fade in parents
        while(currentSpan.parent().length > 0) {
            currentSpan = currentSpan.parent();
            if(!currentSpan.is(':visible')) {
                currentSpan.fadeIn();
            }
        }

        currentIndex++;
        if (currentIndex - 1 > spanIdList.length / 2) {
            //do it again
            var currentSpan = $('#'+spanIdList[currentIndex]);
            currentSpan.fadeIn();
            //fade in parents
            while(currentSpan.parent().length > 0) {
                currentSpan = currentSpan.parent();
                if(!currentSpan.is(':visible')) {
                    currentSpan.fadeIn();
                }
            }
            currentIndex++;
        }
    });

    Mousetrap.bind('s k i p', function(e) {
        if (!frontFaded) {
            frontFaded = true;
            $('#frontground').removeClass('faded');
            $('#frontground').addClass('barely-faded');
            //finally, unhide the frontground
            $('#frontground').fadeIn();
            $('#background').fadeOut();
        }
        $('.hidden-p').fadeIn();
        $('.hidden-p').parents().fadeIn();
        currentIndex = spanIdList - 1;
        //done, all faded in
    });

    //hook up the weird way of doing links
    $('.link').click(function(e){
        var link = $(e.target);
        var i = 0;
        while(!link.hasClass('link')) {
            link = link.parent();
            if(i>10) {
                throw new Error('Too much parents for link.');
            }
            i++;
        }
        document.location = link.data('link');
    });

});
