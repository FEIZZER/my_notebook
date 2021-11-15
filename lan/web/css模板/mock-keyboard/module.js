console.log('js file in');
let Keys = document.getElementsByClassName('key');
for(let i=0;i<Keys.length;i++) {
    Keys[i].addEventListener('animationend', function(){
        if(this.id == 'space') {
            this.className = 'key space';
        }
        else {
            this.className = 'key';
        }
    })
    Keys[i].onclick = function(){
        if(this.id == 'space') {
            this.className = 'key space animation'
        }
        else{
            this.className = 'key animation';
        }
}};
let board = document.getElementsByClassName('board-container')[0];
document.onkeydown = function(e){
    e = e||window.event;
    
    if(e.keyCode == 32) {
        e.preventDefault();
        let key = document.getElementById('space');
        key.className = 'key space animation';
    }
    else {
        let id = String.fromCharCode(e.keyCode);
        let key = document.getElementById(id.toLowerCase());
        key.className = 'key animation';
    }
}