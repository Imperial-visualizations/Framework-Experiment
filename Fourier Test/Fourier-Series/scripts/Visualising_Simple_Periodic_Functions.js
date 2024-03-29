//Global Initial Parameters:
const layout_2 = {
    autosize: true,
    hovermode: "closest",
    margin: {l:30, r:30, t:30, b:30},
    showlegend: false,
    xaxis: {range: [-5,5], zeroline: true, title: "x"},
    yaxis: {range: [-5,5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};

let defaultHref = window.location.href;
let initX = 0, initY = 0;
let resolution_2 = 2000;
// set the step of the x axis from -2pi to 2pi
let z_1 = numeric.linspace(-2*Math.PI,2*Math.PI,resolution_2);
//----------------------------------------------------------------------------------------------------------------------
//VERY IMPORTANT!!!
// 0 is triangular, 1 is square, 2 is sawtooth, 3 is delta's, 4 is parabola, 5 is x, 6 is |x|,
let shape = 0;
//----------------------------------------------------------------------------------------------------------------------


// initialize the Cartesian coordinates for the plots and the functions
function initFourier_2() {
    Plotly.purge("graph_subVis");
    Plotly.newPlot("graph_subVis", computePlot(z_1), layout_2);
    return;
}


// sum up all the number in the array
function adding(array){  
    let result = 0
    for(let i =0; i<array.length; ++i){
        result+=array[i];
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Start. Functions to plot the Fourier Series

// select the kind of Fourier Series you want
function selection(n,A,L,x,type){
    //Is summand of the particular function
    if (type===0){
        formula = -(8*A*1/((2*(n)-1) *Math.PI)**2)*(-1)**(n) * Math.sin(x*(2*n -1) *Math.PI /L);
    } else if (type===1){
        formula = 2*A/(n*Math.PI) *(1-(-1)**n) *Math.sin(n*Math.PI *x/L);
    } else if (type===2){
        formula = 2*A*(-1)**(n+1) /(n*Math.PI) * Math.sin(n *Math.PI* x/L);
    } else if (type===3){
        formula = 1/L * Math.cos(n*Math.PI*x/L);
    } else if (type===4){
        if (n===0){
            formula=(2*L**2)/3;
        } else {
            formula=A*((4*L**2)/(n*Math.PI)**2)*(-1)**n*Math.cos(n*Math.PI*x/L);
        }
    } else if (type===6){
        if (n===0){
            formula=A*L;
        } else {
            formula=(2*A*L/(n*Math.PI)**2)*((-1)**(n) -1)*Math.cos(n*Math.PI*x/L);
        }
    }
    return formula;
}

// sum up all the terms in the Fourier Series
// so at x, we have terms n=0, n=1, n=2..., we sum up all the amplitudes y=y0+y1+y2+... y0 at n=0, y1 at n=1, y2 at n=2...
function summation(x) {
    //Goes through and sums up each component of the summand up to N
    let N = parseFloat(document.getElementById('NController').value);
    let L = parseFloat(document.getElementById('LController2').value);
    let A = parseFloat(document.getElementById('AController2').value);

    n = numeric.linspace(1,N,N);


    let y = [];


    for (let i = 0; i < N; ++i){
        y.push(selection(n[i],A,L,x,shape));
        //y.push((8*A/((2*n[i]-1)*Math.PI)**2)*((-1)**n[i])*Math.sin((2*n[i]-1)*Math.PI*x/L));
    }
    let sum = adding(y);
    return sum;
}


function a_zero(shape,A,L){
// Returns a_0 for the particular function
    if (shape === 0) {
        a = 0;
    }else if (shape === 1){
        a = 0;
    }else if (shape ===2){
        a = 0;
    }else if (shape ===3){
        a = 1.0/L;
    }else if (shape ===4){
        a = (2.0/3)*A*L**2;
    }else if (shape ===6){
        a = A*L;
    }
    return a
}

function c_intercept(shape, N,A,L) {
    let number = a_zero(shape,A,L)/2;
    for (let n = 1; n < N; ++n){
        number += selection(n, A,L, 0, shape);
        }

    return number
}



// plot the Fourier series
// y_values_cheat is to set the each of the value equals its midpoint value plus the y_value
// so all the y_value_cheat starts at the midpoint of the y_value (equivalently, it's the average value)
function computePlot(x){
    //Just plots the sum approximation of the function
    let N = parseFloat(document.getElementById('NController').value);
    let L = parseFloat(document.getElementById('LController2').value);
    let A = parseFloat(document.getElementById('AController2').value);

    let x_values = [];
    let y_values = [];
    let y_values_cheat = [];

    for (let i = 0; i < x.length ; ++i){
        y_values.push(summation(x[i]));
        x_values.push(x[i]);
    }
    for (let i = 0; i< y_values.length; ++i){
        y_values_cheat.push(-y_values[y_values.length/2]+y_values[i] + c_intercept(shape, N,A,L));

        //The part "-y_values[y_values.length/2] +y_values[i]" centres
        //the equation so that the y value is equal to zero at x = 0
        //the "c_intercept" part then shifts it all to the correct height.
        //This was a bit of a long convoluted way to do this but I can't find the mistake,
        //so this fixes it. It's not too time consuming which is good.
    }
    let data;
    if (shape === 3){
        data=[
         {
            type:"scatter",
            mode:"lines",
            x: x_values,
            y: y_values,
            line:{color:"#960078", width:3, dash: "dashed"},
         },
        ];
    } else {
        data=[
         {
            type:"scatter",
            mode:"lines",
            x: x_values,
            y: y_values_cheat,
            line:{color:"#960078", width:3, dash: "dashed"},
         },
        ];
    }
    return data;


}
// End. Functions to plot the Fourier Series.
//----------------------------------------------------------------------------------------------------------------------


/** updates the plot according to the slider controls. */
// Plotly.animate does not support bar charts, so need to reinitialize the Cartesian every time.
function updatePlot_3() {
    let data;
    // NB: updates according to the active tab
   
        $(document).ready(() => { if (shape===3) {
            $('#A').hide(); console.log('hidden')
        } else {
           $('#A').show(); console.log('shown')
        }})
    data = computePlot(z_1);
    //This is animation bit.
    Plotly.animate(
        'graph_subVis',
        {data: data},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}

function main_3(selectedValue) {
    initFourier_2();
    /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit"));
            //NB: Display values are restricted by their definition in the HTML to always display nice number.
            updatePlot_3(); //Updating the plot is linked with display (Just My preference)
        });

    });

    // as you select the functions you want from the scroll down
    // change the shape and the plots
    // change the titles and the math derivations
    
        
        if (selectedValue==="main"){
            shape = 0;
        } else if (selectedValue==="triangular"){
            shape = 0;
            updatePlot_3();
        } else if (selectedValue==="square"){
            shape = 1;
            updatePlot_3();
        } else if (selectedValue==="sawtooth"){
            shape = 2;
            updatePlot_3();
        } else if (selectedValue==="dirac"){
            shape = 3;
            updatePlot_3();
        } else if (selectedValue==="parabola"){
            shape = 4;
            updatePlot_3();
        }  else if (selectedValue==="mode"){
            shape = 6;
            updatePlot_3();
        }
        $(".title").hide();
        $("#"+selectedValue+"Title").show();
        initFourier_2();
    

    initFourier_2();
}
 //Load main when document is ready.

