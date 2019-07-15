export class App {
  public message: string = 'from Aurelia!';
  rows: any[];

  activate(){
    this.setRows();
  }

  clicked() {
    // eslint-disable-next-line no-alert
    alert('A primary button click or a touch');
  }

  
  setRows(){
    this.rows = [
      {
        name: 'hola',
        direccion: 'pelon'
      },
      {
        name: 'hola 2',
        direccion: 'pelon'
      },
    ];
  }  

  onSelect(row){
    debugger;
    console.log(`row ${row.name} selected`);
  }

  onDiselect(row){
    debugger;
    console.log(`row ${row.name} diselected`);
  }

}
