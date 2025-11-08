let running = false;
let n = 20;
let speed = 400;
let array = [];
let buttonslider = document.getElementById("Number");

function btn_off() {
    let buttonplay = document.getElementById("buttonplay");
    buttonplay.disabled = true;
    buttonslider.disabled = true;
    buttonplay.style.cursor = "not-allowed";
    buttonslider.style.cursor = "not-allowed";
}

function btn_on() {
    let buttonplay = document.getElementById("buttonplay");
    buttonplay.disabled = false;
    buttonslider.disabled = false;
    buttonplay.style.cursor = "pointer";
    buttonslider.style.cursor = "pointer";
}

reset();

function reset() {
    running = false;
    for (let i = 0; i < n; i++) {
        array[i] = (Math.random() * 0.8 + 0.2);
    }
    showBars();
    document.addEventListener("DOMContentLoaded", function () {
        btn_on();
    });
}

function play() {
    btn_off();
    const copy = [...array];
    const moves = MergeSortWithMoves(copy);
    animate(moves);
}

function animate(moves) {
    if (running == false) {
        btn_on();
        showBars();
        return;
    }
    if (moves.length == 0) {
        showBars();
        btn_on();
        return;
    }
    const move = moves.shift();
    if (move.type == "swap") {
        const [i, j] = move.indices;
        [array[i], array[j]] = [array[j], array[i]];
    } else if (move.type == "overwrite") {
        array[move.targetIndex] = move.value;
    }
    showBars(move);
    setTimeout(function () {
        animate(moves);
    }, speed);
}

function MergeSortWithMoves(array) {
    running = true;
    const moves = [];
    
    function merge(start, mid, end) {
        let i = start;
        let j = mid + 1;
        let k = start;
        const tempArray = [];
        
        while (i <= mid && j <= end) {
            moves.push({ indices: [i, j], type: "comp" });
            if (array[i] <= array[j]) {
                tempArray.push(array[i]);
                i++;
            } else {
                tempArray.push(array[j]);
                j++;
            }
        }
        
        while (i <= mid) {
            tempArray.push(array[i]);
            i++;
        }
        
        while (j <= end) {
            tempArray.push(array[j]);
            j++;
        }
        
        for (let idx = 0; idx < tempArray.length; idx++) {
            const targetIndex = start + idx;
            moves.push({ 
                type: "overwrite", 
                targetIndex: targetIndex, 
                value: tempArray[idx] 
            });
            array[targetIndex] = tempArray[idx];
        }
    }
    
    function mergeSort(start, end) {
        if (start < end) {
            const mid = Math.floor((start + end) / 2);
            mergeSort(start, mid);
            mergeSort(mid + 1, end);
            merge(start, mid, end);
        }
    }
    
    mergeSort(0, array.length - 1);
    return moves;
}

function showBars(move) {
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.style.width = (100 / array.length) + "%";
        bar.style.backgroundColor = "#66FCF1";
        bar.style.borderRadius = "15px";
        bar.style.position = "relative";
        bar.style.display = "flex";
        bar.style.alignItems = "center";
        bar.style.justifyContent = "center";
        bar.classList.add("bar");
        if (move) {
            if (move.type == "swap" && move.indices && move.indices.includes(i)) {
                bar.style.backgroundColor = "#FF6B6B";  // Red for swaps
            } else if (move.type == "comp" && move.indices && move.indices.includes(i)) {
                bar.style.backgroundColor = "#4A90E2";  // Blue for comparisons
            } else if (move.type == "overwrite" && move.targetIndex === i) {
                bar.style.backgroundColor = "#FF6B6B";  // Red for overwrites (merging)
            }
        }
        if (array.length <= 60) {
            const label = document.createElement("div");
            label.classList.add("bar-label");
            label.textContent = Math.round(array[i] * 100);
            label.style.color = "black";
            label.style.fontWeight = "bold";
            label.style.fontSize = "12px";
            bar.appendChild(label);
        }
        container.appendChild(bar);
    }
}

function sliderChange() {
    let slider = document.getElementById("Number").value;
    document.getElementById("sliderRangeValue").innerHTML = slider;
    n = slider;
    array = [];
    reset();
}

function speedChange() {
    let spd = document.getElementById("Speed").value;
    speed = 1000 - spd * 100;
    document.getElementById("speedRangeValue").innerHTML = spd;
}

// SCROLL TO TOP BUTTON
let mybutton = document.getElementById("TopBtn");
window.onscroll = scrollFunction;

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
