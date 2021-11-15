window.addEventListener("DOMContentLoaded",setStyle,false);
window.onload = function() {
    navi = document.getElementsByClassName('navigation')[0];
    navi.onmouseover = function(e){
        e = e || window.event;
        initialPositionX = e.clientX;
        setAnimate();
    }
    navi.onmouseout = function(){
        setAnimationVat();
    }
}
function setStyle(){
    console.log("DomContent loaded over");
    let navImgs = document.getElementsByClassName('navi-img');
    console.log(navImgs);
    for(let i=0;i<navImgs.length;i++) {
        navImgs[i].style.width = screen.width + "px";
    }
}
function setAnimate() {
    navImgs = document.getElementsByClassName('navi-img');
    for(let i=0;i<navImgs.length;i++) {
        navImgs[i].style.transition = 'none';
    }
    navi.onmousemove = function (e) {
        e = e || window.event;
        let changedPositionX = e.clientX - initialPositionX;
        let blur_1 = 4 + 4 * changedPositionX / screen.width;
        navImgs[0].style.filter = "blur(" + blur_1 + "px)";
        let translate_1 = 5*changedPositionX/screen.width;
        navImgs[0].style.transform = `translateX(${translate_1}px)`;

        let blur_2 = Math.abs(4 * changedPositionX / screen.width)
        navImgs[1].style.filter = "blur(" + blur_2 + "px)";
        let translate_2 = 8*changedPositionX/screen.width;
        navImgs[1].style.transform = `translateX(${translate_2}px)`;

        let blur_3 = 2 + 2*changedPositionX/screen.width;
        navImgs[2].style.filter = `blur(${blur_3}px)`;
        let translate_3 = 10*changedPositionX/screen.width;
        navImgs[2].style.transform = `translateX(${translate_3}px)`;

        let blur_4 = 4 + 4 * changedPositionX / screen.width;
        navImgs[3].style.filter = `blur(${blur_4}px)`;
        let translate_4 = 12*changedPositionX/screen.width;
        navImgs[3].style.transform = `translateX(${translate_4}px)`;

        let blur_5 = 5 - Math.abs(8*changedPositionX/screen.width);
        navImgs[4].style.filter = `blur(${blur_5}px)`;
        let translate_5 = 15*changedPositionX/screen.width;
        navImgs[4].style.transform = `translateX(${translate_5}px)`;

        let blur_6 = 6 - Math.abs(12*changedPositionX/screen.width);
        navImgs[5].style.filter = `blur(${blur_6}px)`;
        let translate_6 = 20*changedPositionX/screen.width;
        navImgs[5].style.transform = `translateX(${translate_6}px)`;
    }

}
function setAnimationVat() {
    for(let i=0;i<navImgs.length;i++) {
        navImgs[i].style.transition = 'all 0.5s';
    }
    navImgs[0].style.filter = "blur(4px)";
    navImgs[1].style.filter = "blur(0px)";
    navImgs[2].style.filter = "blur(2px)";
    navImgs[3].style.filter = "blur(4px)";
    navImgs[4].style.filter = "blur(5px)";
    navImgs[5].style.filter = "blur(6px)";

    navImgs[0].style.transform = "translateX(0px)";
    navImgs[1].style.transform = "translateX(0px)";
    navImgs[2].style.transform = "translateX(0px)";
    navImgs[3].style.transform = "translateX(0px)";
    navImgs[4].style.transform = "translateX(0px)";
    navImgs[5].style.transform = "translateX(0px)";
}