import { Component, createElement} from "./frameWork.js";

class Carousel extends Component{
    //初始化类，依据 div 元素，创建类的根 DOM
    constructor() {
        super();
        //空对象存储 attributes ，为重写 setAttribute 方法找容器；
        this.attributes = Object.create(null);
    }
    //为了使用 src={photos} 中链接，故重写了 setAttribute 方法，
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    mountTo(parent) {
        //由于图片在属性上，先分析属性，得到了图片链接，render 中才能形成 DOM ；
        //先确保 mountTo 之后调用 render ，才能最终确保 render 在 setAttribute 之后；
        //所以需要重写mountTo；
        parent.appendChild(this.render());
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add("wrapper");
        //根据属性中的内容，生成新的 DOM 
        for (const attribute of this.attributes.src) {
            const child = document.createElement("div");
            child.style.backgroundImage = `url(${attribute})`;
            this.root.appendChild(child);
        }

        let position = 0;
        this.root.addEventListener("mousedown", (event) => {
            let children = this.root.children;
            //记录鼠标起始x坐标
            let startX = event.clientX;
            let mouseMove = event => {
                //鼠标x坐标移动的距离
                let moveX = event.clientX - startX;
                let clientWidth = event.target.clientWidth
                //***与相同的*对应可解开注释***当前是第几个
                let current = position - ((moveX - moveX % clientWidth) / clientWidth);
                // let current = position - Math.round(moveX / clientWidth);
                //当前这个及其前后，3张图的便利，然后分别做动画
                for (const offset of [-1, 0, 1]) {
                    //分别为
                    let pictureIndex = current + offset;
                    pictureIndex = (pictureIndex + children.length) % children.length;
                    //为了使 dom 跟随鼠标移动符合人的直觉，鼠标摁下选中图片时关闭过渡动画效果，完成接下来的图片跟随鼠标移动；
                    children[pictureIndex].style.transition = "none";
                    //移动当前 child 的 DOM 元素；
                    //注：由于是操作改变的css属性，故当前的移动不以上一次的移动为前体条件，依然是以初次图片的位置为前提条件；
                    //***与相同的*对应可解开注释***
                    // children[pictureIndex].style.transform = `translateX(${- pictureIndex * 614 + offset * 614}px)`;
                    children[pictureIndex].style.transform = `translateX(${- pictureIndex * 614 + offset * 614 + moveX % 614}px)`;
                }
            };
            
            let mouseUp = event => {
                let moveX = event.clientX - startX;
                //定位移动到第几张图片
                position = position - Math.round(moveX / event.target.clientWidth);
                
                for (const offset of [0, -Math.sign(Math.round(moveX / 614) - moveX + 307 * Math.sign(moveX))]) {
                    let pictureIndex = position + offset;
                    pictureIndex = (pictureIndex + children.length) % children.length;
                    if (offset === 0) {
                        position = pictureIndex;
                    }
                    children[pictureIndex].style.transition = "";
                    children[pictureIndex].style.transform = `translateX(${- pictureIndex * 614 + offset * 614}px)`;
                }

                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
            }

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        })

        // let currentIndex = 0;
        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length;

        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     //由于每一次轮播时，current 位置都是正确的；
        //     //故在轮播前先将 next 放到正确的位置，此时不需要 css 中的过渡动画；
        //     next.style.transition = "none";
        //     //下一张图片放到正确位置：
        //     //则 next 需要移动的长度即为：(current 的当前位置的末尾/当前 next 的位置 1 * 100%) - (第几个 next 的位置 nextIndex * 100%)
        //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`

        //     //由于上面一行设置的 next.style.transform 会被下方的动画覆盖，故需要添加延时器
        //     setTimeout(() => {
        //         //next 移动到相应位置后，在轮播中又需要 css 中的过渡动画；
        //         next.style.transition = "";
        //         //轮播动画
        //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        //         next.style.transform = `translateX(${- nextIndex * 100}%)`

        //         currentIndex = nextIndex;
        //     }, 30)
        // }, 3000)


        return this.root;
    }
}

let photos = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
]

//此处，在打包完成的代码中，调用了 createElement 
let a = (
    <Carousel src={photos}>
    </Carousel>
)

a.mountTo(document.body);