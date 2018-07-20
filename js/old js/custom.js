function sel(selector){
    return document.querySelector(selector);
}
function selA(selector){
    return document.querySelectorAll(selector);
}
function show(item){
    item.classList.remove("hidden");
}
function hide(item){
    item.classList.add("hidden");
}      


       
        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {

             // scrolling back to top : showing and hiding
            var distance = 100;
            if (document.body.scrollTop > distance || document.documentElement.scrollTop > distance) {
                
                sel("#go-up").classList.remove("shrink");
                sel("#go-up").classList.add("grow");
            } else {
                sel("#go-up").classList.add("shrink");
            }


            //activating and deactivating nav items
            //distance of the top of the screen from the top of the document
            var st = $(this).scrollTop();
            var wh = screen.height;
            var count = 0;
            //minimum length for a div to be considered visible : half of the screen
            var mva = (wh/2)-1;

            $("#content-space>[id^=section]").each(function() {
                count = count+1;
               

                var itemtop = $(this).offset().top;
                var itembottom = $(this).offset().top + $(this).height();

                // st + half of the screen
                // in effect , nst is the midpoint we're using for reference
                var nst = st+mva;
                console.log("mid "+nst+" --- "+itemtop+"  "+itembottom);

                //comparison based on midpoint
                if(nst > itemtop && nst <= itembottom ){                    
                    var id = $(this).attr('id');
                    $('a[href="#'+id+'"]').addClass('active');
                }else{
                    var id = $(this).attr('id');
                    $('a[href="#'+id+'"]').removeClass('active');   
                } 
                //comparison based on top of screen
                var topoffset = 870;  //height of navbar+height of title
                if(st > itemtop+topoffset && st <= itembottom-200 ){
                    $(this).find(".video-content").addClass('active');                
                  
                } 
                // else{
                //     if(st > itembottom+100){
                //         $(this).find(".video-content").removeClass('active');  
                //         } 
                // }     
            });

        }


       
        

       



        // assigning smooth animation to each section when clicking the navigation buttons
    $(function() {

        function filterPath(string) {
            return string
            .replace(/^\//,'')
            .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
            .replace(/\/$/,'');
        }

        var locationPath = filterPath(location.pathname);
        var scrollElem = scrollableElement('html', 'body');

        // Any links with hash tags in them (can't do ^= because of fully qualified URL potential)
        $('a[href*=#]').each(function() {

            // Ensure it's a same-page link
            var thisPath = filterPath(this.pathname) || locationPath;
            if (  locationPath == thisPath
                && (location.hostname == this.hostname || !this.hostname)
                && this.hash.replace(/#/,'') ) {

                    // Ensure target exists
                    var $target = $(this.hash), target = this.hash;
                    if (target) {

                        
                        $(this).click(function(event) {

                            // Find location of target
                            var targetOffset = $target.offset().top;
                            // Prevent jump-down
                            event.preventDefault();

                            // Height of Navbar
                            var navHeight = 80;

                            // Animate to target
                            console.log(targetOffset);
                            modifiedTargetOffset = targetOffset-navHeight;
                            console.log(modifiedTargetOffset);

                            $(scrollElem).animate({scrollTop: targetOffset}, 400, function() {

                            //     // Set hash in URL after animation successful
                            //     location.hash = target;

                            });
                        });
                    }
            }

        });

        // Use the first element that is "scrollable"  (cross-browser fix?)
        function scrollableElement(els) {
            for (var i = 0, argLength = arguments.length; i <argLength; i++) {
                var el = arguments[i],
                $scrollElement = $(el);
                if ($scrollElement.scrollTop()> 0) {
                    return el;
                } else {
                    $scrollElement.scrollTop(1);
                    var isScrollable = $scrollElement.scrollTop()> 0;
                    $scrollElement.scrollTop(0);
                    if (isScrollable) {
                        return el;
                    }
                }
            }
            return [];
        }

    });


    // Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;


$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var navbarHeight = $('#nav-menu').outerHeight();
    var st = $(this).scrollTop();

    if(st>window.innerHeight){
        $('#nav-menu').removeClass('nav-transparent');
    }else{
        $('#nav-menu').addClass('nav-transparent');
    }
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('#nav-menu').addClass('nav-up');
    } else {
        // Scroll Up

        // if(st + $(window).height() < $(document).height()) {
             $('#nav-menu').removeClass('nav-up');
        // }
    }
    
    lastScrollTop = st;
}