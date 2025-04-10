import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { from } from 'rxjs';

interface Trip {
  id: string;
  from: string;
  to: string;
  level: number;
  isDuplicate: boolean;
  index: number;
  cx: number;
  cy: number;
}

@Component({
  selector: 'app-trip-con-one',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './trip-con-one.component.html',
  styleUrl: './trip-con-one.component.css'
})
export class TripConOneComponent implements OnInit {

  trips:Trip[]=[];
  fromAddress:string='';
  toAddress:string='';
  
  @ViewChild('fromInput') fromInput: ElementRef;



  controls={
    controlX1:160,
    controlY1:0,
    controlX2:-160,
    controlY2:0
  }

  color:string[]=[];

  graphProps={
    lineWidth:240,
    circleLineGap:10,
    circleRadius:5,
    circleGap:190,
    lineGap:190
  }

  ngOnInit(): void {
    // this.addDummyTrips();
    this.createRouteGraph();
  }

  // This method is used to add dummy trips for testing purposes
  addDummyTrips(){
    let trip:Trip[]=[
      {
        from:'Hyderabad',
        to:'Chennai',
        level:1,
        id:crypto.randomUUID(),
        isDuplicate:false,
        index:0,
        cx:50,
        cy:100
      },
      {
        from:'Chennai',
        to:'Bangalore',
        level:1,
        id:crypto.randomUUID(),
        isDuplicate:false,
        index:1,
        cx:250,
        cy:100
      },
      {
        from:'Bangalore',
        to:'Hyderabad',
        level:2,
        id:crypto.randomUUID(),
        isDuplicate:true,
        index:2,
        cx:450,
        cy:200
      },
      {
        from:'Hyderabad',
        to:'Mumbai',
        level:1,
        id:crypto.randomUUID(),
        isDuplicate:false,
        index:3,
        cx:650,
        cy:100
      },
      {
        from:'Mumbai',
        to:'Delhi',
        level:1,
        id:crypto.randomUUID(),
        isDuplicate:false,
        index:4,
        cx:850,
        cy:100
      }
    ]
    
    this.trips.push(...trip);
  }

  // This method is used to check if the trip is duplicate or not
  checkIsDuplicate(from:string, to:string):boolean{
    if(this.trips.length==0){
      return false;
    }
    const lastIndex=this.trips.length-1;
    if(this.trips[lastIndex].from==from && this.trips[lastIndex].to==to){
      return true;
    }
    else{
      return false
    }
  }

  //This method is to add the new trip to the trips array
  addRoute(){
    this.fromAddress=this.fromAddress.trim();
    this.toAddress=this.toAddress.trim();
    if(this.fromAddress!='' && this.toAddress!=''){
      let isDuplicate=this.checkIsDuplicate(this.fromAddress, this.toAddress);
      if(isDuplicate){
        const lastIndex=this.trips.length-1;
        this.trips[lastIndex].level=2;
        this.trips[lastIndex].isDuplicate=true;
        this.trips[lastIndex].cy=200;
      }
      const newTrip:Trip={
        from:this.fromAddress,
        to:this.toAddress,
        level:this.checkIsDuplicate(this.fromAddress, this.toAddress)?2:1,
        id:crypto.randomUUID(),
        isDuplicate:this.checkIsDuplicate(this.fromAddress, this.toAddress),
        index:this.trips.length,
        cx:this.trips.length>0?this.trips[this.trips.length-1].cx+200:50,
        cy:this.checkIsDuplicate(this.fromAddress, this.toAddress)?200:100
      }
      this.trips.push(newTrip);
      this.fromAddress='';
      this.toAddress='';
      this.createRouteGraph();
      this.fromInput.nativeElement.focus();
    }
  }

  // This method is used to delete the trip from the trips array
  clearRoute(){
    const userConfirm=window.confirm("Are you sure you want to clear the route?")
    if(userConfirm){
      this.trips=[];
      this.color=[];
      this.fromAddress='';
      this.toAddress='';
    }
    this.createRouteGraph();
  }


  // This method is used to generate a random color for the trip lines
  getRandomColor(): string {
    const r = Math.floor(Math.random()*180);
    const g = Math.floor(Math.random()*180);
    const b = Math.floor(Math.random()*180);
    return `rgb(${r}, ${g}, ${b})`;
  }
  

  // This method is used to create the route graph using D3.js
  createRouteGraph(){
    const width='100%'
    const height=400;

    d3.select("#tripOne").selectAll("*").remove(); // Clear previous SVG elements

    

    const svgMain=d3.select("#tripOne")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "border: 1px solid black;")

    const svg = svgMain.append("g");
    const zoom = d3.zoom()
    .on("start", (event) => {
      svgMain.style("cursor", "grab"); 
    })
    .on("zoom", (event) => {
      svgMain.style("cursor", "grabbing");
      svg.attr("transform", event.transform); 
    })
    .on("end", (event) => {
      svgMain.style("cursor", "default");
    })

    svgMain.call(zoom);

    let tooltip=d3.select("#tooltip")

    for(let i=0;i<this.trips.length;i++){

      let color= this.color[i]!=undefined?this.color[i]:this.getRandomColor();
      if(this.color[i]==undefined){
        this.color[i]=(color);
      }

      svg.append("circle")
      .attr("cx", this.trips[i].cx)
      .attr("cy", this.trips[i].cy)
      .attr("r", this.graphProps.circleRadius)
      .attr("stroke",color)
      .attr("fill", this.trips[i].isDuplicate ? "white" : color)
      .on("mouseover", (event) => {
        d3.select(event.target).attr("stroke-width", 3);
        tooltip.style("display", "block")
        .html(`<strong>${this.trips[i].from} to ${this.trips[i].to}</strong>`)
      })
      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event) => {
        d3.select(event.target).attr("stroke-width", 1);
        tooltip.style("display", "none");
      })
      
      svg.append("text")
      .attr("x", this.trips[i].cx-40)
      .attr("y", this.trips[i].cy+20)
      .attr("fill", color)
      .text(this.formatCityName(this.trips[i].from) + " to " + this.formatCityName(this.trips[i].to));

      if (i < this.trips.length - 1) {
        const nextTrip = this.trips[i + 1];
        const trip = this.trips[i];
  
        // Calculate control points for the S-curve
        const controlX1 = trip.cx+this.controls.controlX1; 
        const controlY1 = trip.cy-this.controls.controlY1; 
        const controlX2 = nextTrip.cx+this.controls.controlX2; 
        const controlY2 = nextTrip.cy-this.controls.controlY2;
  
        // Create the S-shaped path data
        const pathData = `M ${trip.cx+10} ${trip.cy} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${nextTrip.cx-10} ${nextTrip.cy}`;
  
        svg.append("defs")
          .append("marker")
          .attr("id", this.trips[i].id)
          .attr("viewBox", "0 0 10 10")
          .attr("refX", 8.12)
          .attr("refY", 5)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M 0 0 L 10 5 L 0 10 Z") 
          .attr("fill", color);
        svg.append("path")
          .attr("d", pathData) 
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("marker-end", ()=>{
            if(i<this.trips.length-1 && this.trips[i].to!=this.trips[i+1].from && !this.trips[i+1].isDuplicate){
              return "url(#"+this.trips[i].id+")"; 
            }else{
              return ""
            }
          });
      }

    }
  }

  // This method is used to format the city name to 3 letter code
  formatCityName(cityName:string):string{
    return cityName.slice(0,3).toUpperCase()
  }

}
