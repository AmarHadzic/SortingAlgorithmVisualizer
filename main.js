document.addEventListener("DOMContentLoaded", function(){
    //get components of different areas of website
    const slicesArea = document.getElementById("slicesArea");
    const slider = document.getElementById("slider");
    const randomizer = document.getElementById("random-btn");
    const sorter = document.getElementById("sort-btn");
    const bubbleSortOption = document.querySelector('input[name="option"][value="bubble"]');
    const selectionSortOption = document.querySelector('input[name="option"][value="selection"]');
    const insertionSortOption = document.querySelector('input[name="option"][value="insertion"]');
    let selectedOption = "";

    //makes default array on load
    let rectangles = [];
    let firstRectangleSizes = randomizeArray(25);

    bubbleSortOption.addEventListener("click", () => {
        selectedOption = "bubble";
    });

    selectionSortOption.addEventListener("click", () => {
        selectedOption = "selection";
    });

    insertionSortOption.addEventListener("click", () => {
        selectedOption = "insertion";   
    });

    //fills default array
    for(var i=0; i<firstRectangleSizes.length; i++){
        var rectangle = document.createElement("div");
        rectangle.style.width = slicesArea.offsetWidth/slider.value + "vh";
        rectangle.style.height = firstRectangleSizes[i] + "vh";
        rectangle.style.backgroundColor = "blue";
        rectangle.classList.add("rectangle");
        slicesArea.appendChild(rectangle);
        rectangles.push(rectangle);
    }
    

    //when slider is activated, makes new random array based on user input
    slider.addEventListener("input", function(){
        rectangles=[]
        slicesArea.innerHTML = "";
        let rectangleSizes = randomizeArray(slider.value);

        for(var i=0; i<slider.value; i++)
        {

            var rectangle = document.createElement("div");
            rectangle.style.width = slicesArea.offsetWidth/slider.value + "vh";
            rectangle.style.height = rectangleSizes[i] + "vh";
            rectangle.style.backgroundColor = "blue";
            rectangle.classList.add("rectangle");
            slicesArea.appendChild(rectangle);
            rectangles.push(rectangle);

        }
    
    });

    //randomizes the array and sizes of bars
    randomizer.addEventListener("click", function(){
        let numArray = randomizeArray(slider.value);

        for(let i=0; i<rectangles.length; i++)
        {
            //styles bars
            rectangles[i].style.height = numArray[i] + "vh";
            rectangles[i].style.backgroundColor = "blue";
        }

    })

    //sorts the arrays based on selected sort algorithm
    //while sorting, all input buttons become inactive
    sorter.addEventListener("click", function(){
        if(selectedOption === "bubble")
        {   
            buttonsInactive(true);
            bubbleSort();
        }else if(selectedOption ==="insertion")
        {
            buttonsInactive(true);
            insertionSort();
        }else if(selectedOption === "selection")
        {
            buttonsInactive(true);
            selectionSort();
        }
    })


    /*
    * This is a bubble sort algorithm which shows which bars are being compared and swapped
    */
    async function bubbleSort()
    {
        for(var i=0; i<rectangles.length; i++)
        {   
            for(var j=0; j<rectangles.length - 1 - i; j++)
            {
                var height1 = parseFloat(rectangles[j].style.height);
                var height2 = parseFloat(rectangles[j+1].style.height);
                
                //highlights the current bars being compared
                rectangles[j].style.backgroundColor = "red";
                rectangles[j+1].style.backgroundColor = "red";

                if(height1 > height2)
                {
                    //swaps the bar height values
                    var temp = height1;
                    rectangles[j].style.height = rectangles[j+1].style.height;
                    rectangles[j+1].style.height = temp + "vh";
                }
                //sleep function to visualize swaps and comparisons
                await sleep(100);
                rectangles[j].style.backgroundColor = "blue";
                rectangles[j+1].style.backgroundColor = "blue";
            }
            rectangles[rectangles.length-1-i].style.backgroundColor = "green";
        
        }
        //makes all input buttons active again
        buttonsInactive(false);
    }

    /*
    * insertion sort algorithm which highlights current bars being compared
    */
    async function insertionSort()
    {
        for(var i=1; i<rectangles.length; i++)
        {
            let key = parseFloat(rectangles[i].style.height); 
            let j = i-1;
            while(j>=0 && parseFloat(rectangles[j].style.height) > key)
            {
                /*
                *highlights the bar being compared for user
                *setting height to key gives the illusion that the key bar is moving and comparing to the next bar
                */
                rectangles[j+1].style.height = key + "vh";
                rectangles[j+1].style.backgroundColor = "green";
                rectangles[j].style.backgroundColor = "red";
                await sleep(100);

                //after sleep function, sets the bars to their original heights and color
                rectangles[j+1].style.backgroundColor = "blue";
                rectangles[j+1].style.height = rectangles[j].style.height;
                rectangles[j].style.backgroundColor = "blue";
                j = j-1;
            }
            //after finding a smaller bar, swaps the bar next to the smaller one with the key bar
            rectangles[j+1].style.height = key + "vh";
            
        }
        //unlocks all iinput buttons
        buttonsInactive(false);
    }

    async function selectionSort()
    {
        for(var i=0; i<rectangles.length-1; i++)
        {
            let min = i;
            for(j=i+1; j<rectangles.length; j++)
            {
                //min bar highlighted red to compare with the remaining bars to the right
                rectangles[min].style.backgroundColor = "red";

                //these next 3 lines make the current iteration bar red then blue so it looks like it is being compared
                rectangles[j].style.backgroundColor = "red";
                await sleep(100);
                rectangles[j].style.backgroundColor = "blue";

                if(parseFloat(rectangles[j].style.height) < parseFloat(rectangles[min].style.height))
                {
                    //if a smaller bar height is found, original min bar is back to blue
                    //new minimum bar is now red 
                    rectangles[min].style.backgroundColor = "blue";
                    min = j;
                    await sleep(100);
                    rectangles[min].style.backgroundColor = "red";
                }
            }
            //swaps the ith bar with the smallest one and makes it green to mark it as being in correct position
            let tempHeight = rectangles[i].style.height;
            rectangles[i].style.height = rectangles[min].style.height;
            rectangles[min].style.height = tempHeight;
            rectangles[min].style.backgroundColor = "blue";
            rectangles[i].style.backgroundColor = "green";
        }
        //marks all bars as being in correct position and relases all input buttons
        rectangles[rectangles.length-1].style.backgroundColor = "green";
        buttonsInactive(false);
    }


    // this function simply makes any input buttons unavailable or available
    function buttonsInactive(bool)
    {
        if(bool){
            slider.disabled = true;
            randomizer.disabled = true;
            sorter.disabled = true;
        }else{
            slider.disabled = false;
            randomizer.disabled = false;
            sorter.disabled = false;
        }
    }
})

//the point of this function is to get an array of random numbers
function randomizeArray(num){
    let numArray = new Array(num);

    for (let i=0; i<num; i++)
    {
        const minHeight = 15;
        const maxHeight = 700;

        numArray[i] = Math.floor(Math.random() * (maxHeight-minHeight+1) +minHeight) * 0.1;
    }

    return numArray;

}

//sleep function to help visualize what is being compared and swapped
function sleep(ms)
{
    return new Promise((resolve) => setTimeout(resolve, ms));
}

