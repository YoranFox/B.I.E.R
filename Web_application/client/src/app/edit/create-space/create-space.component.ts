import { R3TargetBinder } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeaderService } from 'src/app/shared/header/header.service';

export class SpaceItem{
  type:string = 'empty';
  object:number = 0;
}


export class Space{

  xAmount:number = 0;
  yAmount:number = 0;
  spaceItems: SpaceItem[][] = [];
  

  constructor(x:number, y:number){
    this.xAmount = x;
    this.yAmount = y;

    for(let y =0; y < this.yAmount; y++){
      const row = []
      for(let x =0; x < this.xAmount; x++){
        row.push(new SpaceItem())
      }
      this.spaceItems.push(row)
    }
  }
}


@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.scss']
})
export class CreateSpaceComponent implements OnInit {

  tileSize:string = '10px';
  currentStep:number = 1
  tilesTouched: string[] = [];
  tilesSelected: string[] = [];
  currentTypeSelected:string = 'empty'

  forms: any = {
    1: this.fb.group({
      "x": [null, Validators.required],
      "y":[null, Validators.required],
      "accuracy": ["", Validators.required]
    }),
    2: this.fb.group({
      "space": [null, Validators.required],
    }),

  }

  


  constructor(private fb: FormBuilder, private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.headerTitle.next('Creating 2d space');
  }


  onSubmit(){

  }

  nextStep(){
    switch(this.currentStep){
      case 1:
        this.submitStep1()
        this.currentStep = 2
        var interval = setInterval(() => {
          this.initStep2()
          clearInterval(interval)
        },1000)
        
        break;
      case 2:
        this.submitStep2()
        break;
    }
    
  }

  lastStep(){
    this.currentStep -= 1
  }

  submitStep1(){
    const values = this.forms[1].getRawValue()

    // transform width and height to accuracy
    values.x = Math.ceil(values.x / values.accuracy) * values.accuracy
    values.y = Math.ceil(values.y / values.accuracy) * values.accuracy

    this.forms[1].patchValue(values)

    // create 2d array
    const colAmount = values.x / values.accuracy
    const rowAmount = values.y / values.accuracy
    this.forms[2].get('space').patchValue(new Space(colAmount, rowAmount))

  }

  initStep2(){

    const element = document.getElementById('space-container')!;
    if(element != null){
      const drawWidth = element.clientWidth;
      this.tileSize = (drawWidth / this.forms[2].get('space').value.xAmount) + 'px';
    }



    var moveListener = (e:any) => {
      let element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)!
      if(element.classList[0] === 'tile'){
        switch (e.touches.length) {
          case 1: 
            if(!this.tilesTouched.includes(element.id)){
              this.tilesTouched.push(element.id)
              if(this.tilesSelected.includes(element.id)){
                
              }
              else{
                element.classList.remove('empty')
                element.classList.remove('not-empty')
                element.classList.remove('door')
                element.classList.add(this.currentTypeSelected)
                this.tilesSelected.push(element.id)
              }
            }

            break;
          case 2: 

            break;
        }
      }
    }

    var startListener = (e:any) => {
      if(e.target.classList[0] === 'tile'){
        switch (e.touches.length) {
          case 1: 
            if(this.tilesSelected.includes(e.target.id)){
            }
            else{
              e.target.classList.remove('empty')
              e.target.classList.remove('not-empty')
              e.target.classList.remove('door')
              e.target.classList.add(this.currentTypeSelected)
              this.tilesSelected.push(e.target.id)
            }
            this.tilesTouched.push(e.target.id)

            break;
          case 2: 

            break;
        }
      }
    }

    var stopListener = (e:any) => {
      this.tilesTouched = []
      this.tilesSelected = []

    }

    document.getElementById('space-container')!.addEventListener('touchmove', moveListener, { passive:false });
    document.getElementById('space-container')!.addEventListener('touchend', stopListener, { passive:false });
    document.getElementById('space-container')!.addEventListener('touchstart', startListener, { passive:false });

    // dragula([dndContainer], {
    //     direction: 'horizontal'
    // }).on('drag', function(el, source) {
    //     scrollable = false;
    // }).on('drop', function(el, source) {
    //     scrollable = true;
    // });
  }

  submitStep2(){

  }

  onSelectType(type: string){
    this.currentTypeSelected = type;
  }

}
