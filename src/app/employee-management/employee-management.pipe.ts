import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'employeeManagementPipe'
})
export class EmployeeManagementPipe implements PipeTransform {
    transform(items: any, filter: any): any {
        /*This pipe is used for searching the name, store, role, country, region and status in the material table */

        /* Assign the items filtereddata to the employeeList variable */
        const employeeList = items;

        /* Check the employeeList is empty or undefined, if undefined then return empty */
        if (!employeeList) {
            return [];
        }


        /* Functions to check the filter is applied  and return true or false */
        function isfilterApplied() {
            if (
                filter.employeeSearch ||
                filter.roleSearch && filter.rolesSearch !== 'All' || filter.statusSearch && filter.statusSearch !== 'All'
                || filter.countrySearch && filter.countrySearch !== 'All' || filter.regionSearch && filter.regionSearch !== 'All'
                || filter.storeSearch && filter.storeSearch !== 'All'
            ) {
                return true;
            } else {
                return false;
            }
        }

        /* Functions to check which filter is applied   */
        function applyfilterProperty() {
            const filterDefinedArray = [];
            if (filter.employeeSearch) {
                filterDefinedArray.push('employee');
            }
            if (filter.roleSearch && filter.roleSearch !== 'All') {
                filterDefinedArray.push('role');
            }
            if (filter.statusSearch && filter.statusSearch !== 'All') {
                filterDefinedArray.push('status');
            }
            if (filter.countrySearch && filter.countrySearch !== 'All') {
                filterDefinedArray.push('country');
            }
            if (filter.regionSearch && filter.regionSearch !== 'All') {
                filterDefinedArray.push('region');
            }
            if (filter.storeSearch && filter.storeSearch !== 'All') {
                filterDefinedArray.push('store');
            }
            return filterDefinedArray;
        }

        if (isfilterApplied()) {
            const filterValue = applyfilterProperty();
            const employeeDetailArray: any = [];
            employeeList.filter(row => {
                let loopCount = 0;

                if (filterValue.includes('employee')) {
                    loopCount = row.username.toLowerCase().includes(filter.UserNameSearch.toLowerCase()) ||
                        row.employeeId.toString().includes(filter.UserNameSearch.toString())
                        ? loopCount + 1
                        : loopCount;
                }

                if (filterValue.includes('role')) {
                    loopCount =
                        row.role === filter.roleSearch
                            ? loopCount + 1
                            : loopCount;
                }
                if (filterValue.includes('status')) {
                    loopCount =
                        row.status === filter.statusSearch
                            ? loopCount + 1
                            : loopCount;
                }
                if (filterValue.includes('country')) {
                    loopCount =
                        row.country === filter.countrySearch
                            ? loopCount + 1
                            : loopCount;
                }
                if (filterValue.includes('region')) {
                    loopCount =
                        row.region === filter.regionSearch
                            ? loopCount + 1
                            : loopCount;
                }
                if (filterValue.includes('store')) {
                    loopCount =
                        row.store === filter.storeSearch
                            ? loopCount + 1
                            : loopCount;
                }
                if (loopCount === filterValue.length) {
                    employeeDetailArray.push(row);
                }
            });
            return employeeDetailArray;
        } else {
            return employeeList;
        }
    }

   
}






