import { Routes } from '@angular/router';
import { TripConOneComponent } from './trip-con-one/trip-con-one.component';

export const routes: Routes = [
    {path:'tripConnector',component:TripConOneComponent},
    {path:'**',redirectTo:'tripConnector'} // Default routes
];
