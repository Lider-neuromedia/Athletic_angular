import { Component, OnInit } from '@angular/core';
import { GlobalVarService } from '../common/global-var.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  globalStorage : any;
  usuario : any;
  constructor(public router: Router, private globalVar : GlobalVarService) { 
    this.globalStorage = this.globalVar.user.subscribe(
      value => {
        this.usuario = value;
      }
    );
  }
  ngOnInit(): void {
    if (this.usuario == null) {
      this.router.navigate(['/login']);
    }
  }

}
