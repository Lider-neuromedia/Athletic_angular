import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(private toastr: ToastrService) { }


  showToasterFull(mensaje) {
    this.toastr.success(mensaje);
  }

  showToasterError(mensaje) {
    this.toastr.error(mensaje);
  }

  showToasterUpdate(mensaje) {
    this.toastr.success(mensaje);
  }

  showToasterWarning(mensaje) {
    this.toastr.warning(mensaje);
  }
}
