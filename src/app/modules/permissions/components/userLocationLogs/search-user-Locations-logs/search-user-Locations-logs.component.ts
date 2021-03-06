import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { EmployeeService } from "src/app/modules/employees/services/employee.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ILocationXY } from "../../../models/ILocationXY.interface";
import { IOnlineUsers } from "../../../models/IOnlineUsers.interface";
import { IOnlineUsersCountPerCompany } from "../../../models/IOnlineUsersCountPerCompany.interface";
import { IOnlineUsersSearch } from '../../../models/IOnlineUsersSearch.interface'
import { IUserLogsSearchBox } from "../../../models/IUserLogsSearchBox.interface";
import { OnlineUsersService } from "../../../services/onlineUsers.service";
@Component({
	selector: "search-user-location-logs",
	templateUrl: './search-user-Locations-logs.component.html',
	styleUrls: ['./search-user-Locations-logs.component.scss']
})

export class SearchUserLocationLogsComponent implements OnInit {

	SearchUsersConnectionLogsForm: FormGroup;
	dropUsersData: LookUpModel[] = []

	constructor(private fb: FormBuilder, private toaster: toasterService, private service: OnlineUsersService, private employeeService: EmployeeService, private datePipe: DatePipe) { }

	ngOnInit(): void {

		this.service.clickSearch$.subscribe((data: boolean) => {
			if (data) {
				document.getElementById('search')?.click();
			}
		});

		this.SearchUsersConnectionLogsForm = this.fb.group({
			empId: [null],
			startDate: [new Date().toISOString()],
			endDate: [new Date().toISOString()]
		});

		this.employeeService.getLookupEmployeeData(1005).subscribe(
			(data: LookUpModel[]) => {
				this.dropUsersData = data;
			}
		);

		//this.searchOnlineUsers({companyId:undefined , userStates:true});

	}

	searchUsersConnectionLogs(userLogsSearch: IUserLogsSearchBox) {

		if (userLogsSearch.empId == null || userLogsSearch.endDate == '' || userLogsSearch.startDate == '') {
			this.toaster.openWarningSnackBar('???????? ???? ?????????? ?????????????? ??????????????');
			return;
		}

		userLogsSearch.startDate = this.datePipe.transform(userLogsSearch.startDate, 'MM/dd/yyyy')!;
		userLogsSearch.endDate = this.datePipe.transform(userLogsSearch.endDate, 'MM/dd/yyyy')!;

		this.service.getUsersLocationLogs(userLogsSearch)
			.subscribe(
				(data: ILocationXY[]) => {
					this.service.Locations.next(data);
				}, (error) => {
					this.toaster.openWarningSnackBar('???????????? ??????????');
				}
			);


	}



}