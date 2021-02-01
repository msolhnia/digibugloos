import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class alertService
{
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    
    constructor( private snackBar: MatSnackBar)
    {

    }

    openSnackBar(title: string, isAdded: boolean = true) {
        let message = (isAdded) ? " added to card!" : "";
        this.snackBar.open(title + message, "ok", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}