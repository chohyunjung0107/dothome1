/*--------------------
커서 효과  
--------------------*/
window.addEventListener("mousemove",function(e){
            
    let cursor = document.querySelector(".cursor");
    let X = e.pageX +"px";
    let Y = e.pageY-20+"px";
    cursor.style.cssText = "left:" + X + "; top:" + Y;
    
    gsap.to(cursor, { duration: 2.5, left: X, top: Y});

    });

/*--------------------
원 버튼 : 클릭하면 사이드 메뉴가 우측으로 나옴 
--------------------*/
const oneMenu = document.querySelector(".oneMenu");
    oneMenu.onclick = function(){
        document.querySelector(".menu").classList.toggle("open");            
    }

/*--------------------
사이드 메뉴 무한 스크롤 : 사이드 카테고리 무한 스크롤링 됨
--------------------*/

// Vars
const menu = document.querySelector('.menu')
const items = document.querySelectorAll('.menu--item')

let menuHeight = menu.clientHeight //사용자에게 보여지는 페이지 높이
let itemHeight = items[0].clientHeight //낱개 아이템의 높이 
let wrapHeight = items.length * itemHeight //총 아이템의 높이

let scrollSpeed = 0 
let oldScrollY = 0
let scrollY = 0
let y = 0

// Lerp (선형보간법) : v0시작점 v1도착점 t시작에서 도착까지의 평균치
const lerp = (v0, v1, t) => {
return v0 * ( 1 - t ) + v1 * t
}


// Dispose 
const dispose = (scroll) => {
    gsap.set(items, {
        y: (i) => {
        return i * itemHeight + scroll 
        }, //아이템 사이의 일정한 거리 
        modifiers: {
        y: (y) => {
            const s = gsap.utils.wrap(-itemHeight, wrapHeight - (itemHeight * -0.5), parseInt(y)) 
            //-0.5는 다음 클론과의 간격
            return `${s}px`
        }
        } // 스크롤 할 때 클론이 됨
    })
} 
dispose(0)


// Wheel
const handleMouseWheel = (e) => {
scrollY -= e.deltaY   //delyaY는 아래 스크롤 시 양수 값, 위로 스크롤 시 음수 값을 반환(아래위스크롤에 반응)
//   console.log(scrollY)
}

// Touch
let touchStart = 0
let touchY = 0
let isDragging = false

const handleTouchStart = (e) => {
touchStart = e.clientY || e.touches[0].clientY 
isDragging = true
menu.classList.add('is-dragging')
}
const handleTouchMove = (e) => {
if (!isDragging) return
touchY = e.clientY || e.touches[0].clientY
scrollY += (touchY - touchStart) * 2.5
touchStart = touchY
}
const handleTouchEnd = () => {
isDragging = false
menu.classList.remove('is-dragging')
}


// Listeners
menu.addEventListener('mousewheel', handleMouseWheel)

menu.addEventListener('touchstart', handleTouchStart)
menu.addEventListener('touchmove', handleTouchMove)
menu.addEventListener('touchend', handleTouchEnd)

menu.addEventListener('mousedown', handleTouchStart)
menu.addEventListener('mousemove', handleTouchMove)
menu.addEventListener('mouseleave', handleTouchEnd)
menu.addEventListener('mouseup', handleTouchEnd)

menu.addEventListener('selectstart', () => { return false })


// Resize : 문서의 뷰 사이즈가 변경될 때 이벤트가 작동합니다.
window.addEventListener('resize', () => {
menuHeight = menu.clientHeight
itemHeight = items[0].clientHeight
wrapHeight = items.length * itemHeight
})


// Render : 스크롤 될 때 아이템에 transition값을 줌
const render = () => {
requestAnimationFrame(render)
y = lerp(y, scrollY, .1)
dispose(y)

scrollSpeed = y - oldScrollY
oldScrollY = y

gsap.to(items, {
    scale: 1 -  Math.min(100, Math.abs(scrollSpeed)) * .005,
    rotate: scrollSpeed * 0.2,
})

}
render()