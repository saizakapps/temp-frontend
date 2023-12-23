import { Injectable } from '@angular/core';
import { CommonService } from '../shared/services/incident-services/common.service';
@Injectable({
  providedIn: 'root'
})
export class IncidentFormValidationService {

  constructor(private common:CommonService) { }
  storeValidate(control:any){
  if(control.value.toString()=='' || control.value.toString().trim().length==0){
      return { 'message': 'Please select store' };
  }else{
     return null;
  }
}
nameValidate(control:any){
	let isValid = true;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});

	const numbers = `1234567890`;
	let isNumberValid = true;
  let result2 = numbers.split('').some(number => {
    if (control.value.includes(number)) {
    	isNumberValid = false;
      return true;
    }
    return false;
    
  });
	if(control.value=='' || control.value.trim().length==0){
		isValid = false;
   return { 'message': 'Please enter name' };
	}else if(!isSpecialCharValid){
        return { 'message': 'Name must not allow special characters' };

	}else if(!isNumberValid){
        return { 'message': 'Name must not allow numbers' };

	}else if(control.value.trim().length<3){
		isValid = false;
		return { 'message': 'Name must be minimum 3 characters' };
	}else {
		return null;
	}

}
complainantValidate(control:any){
	let isValid = true;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});

	const numbers = `1234567890`;
	let isNumberValid = true;
  let result2 = numbers.split('').some(number => {
    if (control.value.includes(number)) {
    	isNumberValid = false;
      return true;
    }
    return false;
    
  });
	if(control.value=='' || control.value.trim().length==0){
		isValid = false;
   return { 'message': 'Please enter Complainant' };
	}else if(!isSpecialCharValid){
        return { 'message': 'Complaintant must not allow special characters' };

	}else if(!isNumberValid){
        return { 'message': 'Complaintant must not allow numbers' };

	}else if(control.value.trim().length<3){
		isValid = false;
		return { 'message': 'Complaintant must be minimum 3 characters' };
	}else {
		return null;
	}

}
contactNumberValidate(control:any){
	let isValid = true;
	var Regex=/^[^a-zA-Z]*$/;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});
	if(control.value=='' || control.value.trim().length==0){
	isValid = false;
	return { 'message': 'Please enter contact number' };
	}else if(!Regex.test(control.value))
	{
	isValid = false;
	return { 'message': 'Contact number must not allow alphabets' };
	}
	// else if(!isSpecialCharValid){
    //     return { 'message': 'Contact number must not allow special characters' };
	// }
	// else if(control.value.trim().length<8){
	// isValid = false;
	// return { 'message': 'Contact number must be minimum 8 characters' };
	// }
	else{
		return null;
	}
}
emailValidate(control:any){
	let isValid = true;
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(control.value=='' || control.value.trim().length==0){
    	 isValid = true;
    	 return  { 'message': 'Please enter email' };
    }else if (!re.test(control.value)) {
      isValid = true;
      return { 'message': 'Email is invalid' };
    } else {
      isValid = false;
      return  null;
    }
    
}

ageTypeValidate(control:any){
  if(control.value=='' || control.value.trim().length==0){
    	 return  { 'message': 'Please select age type' };
    }else{
    	return null;
    }
}
ageValueValidate(control:any){
	var Regex=/^[^a-zA-Z]*$/;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});
  if(control.value=='' || control.value.trim().length==0){
    	 return  { 'message': 'Please enter age' };
    }else if(control.value<=0){
    	 return  { 'message': 'Age must be greater then zero' };
    }else if(control.value>99){
    	 return  { 'message': 'Age must be less then or equal to 99' };
    }else if(!Regex.test(control.value))
	{
	return { 'message': 'Age must not allow alphabets' };
	}else if(!isSpecialCharValid){
        return { 'message': 'Age must not allow special characters' };
	}else{
    	return null;
    }
}
incidentDateValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please select incident date' };
    }else{
    	return null;
    }
}
incidentTimeValidate(control:any){
	 const validHHMMstring = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(control.value);
	if(control.value=='' || control.value.trim().length==0){
    	 return  { 'message': 'Please enter incident time' };
    }else if(!validHHMMstring){
       return  { 'message': 'Incident time invalid' };
    }else{
    	return null;
    }
}
reportedTimeValidate(control:any){
   const validHHMMstring = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(control.value);
   if(control.value=='' || control.value.trim().length==0){
       return  { 'message': 'Please enter reported time' };
    }else if((control.value!='' && control.value.trim().length!=0) && !validHHMMstring){
       return  { 'message': 'Reported time invalid' };
    }else{
      return null;
    }
}
productIDValidate(control:any){
	if(control.value=='' || control.value.trim().length==0){
    	 return  { 'message': 'Please enter product Id or product description' };
    }else {
    	return null;
    }
}
minimumLengthValidate(control:any){
	let isValid=true;
	if(control.value.trim().length<3){
		isValid = false;
		//this.focusStyle = '{border: "1px solid red"  };';
		return { 'message': 'Name must be minimum 3 characters' };
	}
	return isValid ? null : { 'message': 'Name must be minimum 3 characters' }
}
notAllowSpecialCharacter(control:any){
	let isValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isValid = false;
		return true;
		}
	return false;
	});
	return isValid ? null : { 'message': 'Name must not allow special characters' }

}
notAllowNumbers(control:any){
	const numbers = `1234567890`;
	let isValid = true;
  let result = numbers.split('').some(number => {
    if (control.value.includes(number)) {
    	isValid = false;
      return true;
    }
 return false;
    
  });
  return isValid ? null : { 'message': 'Name must not allow numbers' };
}
significantNameValidate(control:any){
	let isValid = true;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});

	const numbers = `1234567890`;
	let isNumberValid = true;
  let result2 = numbers.split('').some(number => {
    if (control.value.includes(number)) {
    	isNumberValid = false;
      return true;
    }
    return false;
    
  });
	if((control.value!='' && control.value.trim().length!=0) && control.value.trim().length<3){
		isValid = false;
		//this.focusStyle = '{border: "1px solid red"  };';
		return { 'message': 'Significant name must be minimum 3 characters' };
	}else if((control.value!='' && control.value.trim().length!=0) && !isSpecialCharValid){
        return { 'message': 'Name must not allow special characters' };

	}else if((control.value!='' && control.value.trim().length!=0) && !isNumberValid){
        return { 'message': 'Significant name must not allow numbers' };

	}else {
		return null;
	}

}

evidenceTakenByNameValidate(control:any){
	let isValid = true;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});

	const numbers = `1234567890`;
	let isNumberValid = true;
  let result2 = numbers.split('').some(number => {
    if (control.value.includes(number)) {
    	isNumberValid = false;
      return true;
    }
    return false;
    
  });
	if(control.value=='' || control.value.trim().length==0){
		isValid = false;
		//this.focusStyle = '{border: "1px solid red"  };';
		return { 'message': 'Please enter evidence taken by name ' };
	}else if((control.value!='' && control.value.trim().length!=0) && control.value.trim().length<3){
		isValid = false;
		//this.focusStyle = '{border: "1px solid red"  };';
		return { 'message': 'Evidence taken by name must be minimum 3 characters' };
	}else if((control.value!='' && control.value.trim().length!=0) && !isSpecialCharValid){
        return { 'message': 'Evidence taken by must not allow special characters' };

	}else if((control.value!='' && control.value.trim().length!=0) && !isNumberValid){
        return { 'message': 'Evidence taken by name must not allow numbers' };

	}else {
		return null;
	}

}

validateSubmitIncident(incidentFormData:any,type:any,roleCode:any,formFieldAccess:any){
	let deletescenariowitness = incidentFormData.witnessList.every(witness => witness.witnessDeleted === 1)
	let evidencesarray:any = incidentFormData.evidences.filter((item:any)=>{
		return item.isEvidence == true
	})
	let evidencevideoarray:any = incidentFormData.evidences.filter((item:any)=>{
		return item.evidenceType == 'Video'
	})
	let deletescenarioevidancevideo = evidencevideoarray.every((evidence:any) => evidence.evidenceDeleted === 1)
	let deletescenarioevidance = evidencesarray.every((evidence:any) => evidence.evidenceDeleted === 1)
  let noOFVideo=(incidentFormData.evidences.filter((item:any)=>item.evidenceType=='Video')).length;
  if( (formFieldAccess.store.create || formFieldAccess.store.write) && (incidentFormData.store.toString()=='' || incidentFormData.store.toString().trim().length==0)){
    this.common.openSnackBar('Please choose valid store',2,'Required');
    return false;
  }else if((formFieldAccess.injuredPersonFullName.create || formFieldAccess.injuredPersonFullName.write) && (incidentFormData.injuredPersonFullName=='' || incidentFormData.injuredPersonFullName.trim().length==0)){
    this.common.openSnackBar('Please enter Name of the injured',2,'Required');
    return false;
  }else if((formFieldAccess.complainant.create || formFieldAccess.complainant.write) && (type=='Product') && (incidentFormData.productComplaint=='' || incidentFormData.productComplaint.trim().length==0)){
   this.common.openSnackBar('Please enter complainant name',2,'Required');
    return false;
  }else if((formFieldAccess.ageValue.create || formFieldAccess.ageValue.write) && (incidentFormData.ageValue=='' || incidentFormData.ageValue.trim().length==0)){
    this.common.openSnackBar('Please specify age',2,'Required');
    return false;
  }else if((formFieldAccess.injuredPersonContactNo.create || formFieldAccess.injuredPersonContactNo.write) && (incidentFormData.injuredPersonContactNumber=='' || incidentFormData.injuredPersonContactNumber.trim().length==0)){
    this.common.openSnackBar('Please enter contact number',2,'Required');
    return false;
  }else if((formFieldAccess.emailAddress.create || formFieldAccess.emailAddress.write) && (type=='Contractor' || type=='Employee') && (incidentFormData.injuredPersonEmail=='' || incidentFormData.injuredPersonEmail.trim().length==0)){
    this.common.openSnackBar('Please enter contact email',2,'Required');
    return false;
  }else if((formFieldAccess.emailAddress.create || formFieldAccess.emailAddress.write) && (incidentFormData.injuredPersonEmail!='' && incidentFormData.injuredPersonEmail.trim().length!=0) && !this.common.isValidEmail(incidentFormData.injuredPersonEmail)){
    this.common.openSnackBar('Please enter valid contact email',2,'Required');
    return false;
  }else if((formFieldAccess.eventDateTime.create || formFieldAccess.eventDateTime.write) && (incidentFormData.eventDate=='' || incidentFormData.eventDate==null || incidentFormData.eventDate.length==0)){
    this.common.openSnackBar('Please enter incident date & time',2,'Required');
    return false;
  }
  else if((formFieldAccess.eventDateTime.create || formFieldAccess.eventDateTime.write) && (incidentFormData.eventTime=='' || incidentFormData.eventTime==null || incidentFormData.eventTime.trim().length==0)){
    this.common.openSnackBar('Please enter incident time',2,'Required');
    return false;
  }else if((formFieldAccess.reportedDateTime.create || formFieldAccess.reportedDateTime.write) && (type=='Product') && (incidentFormData.reportedDate=='' || incidentFormData.reportedDate==null || incidentFormData.reportedDate.length==0)){
    this.common.openSnackBar('Please enter reported date & time',2,'Required');
    return false;
  }
  else if((formFieldAccess.reportedDateTime.create || formFieldAccess.reportedDateTime.write) && (type=='Product') && (incidentFormData.reportedTime=='' || incidentFormData.reportedTime==null || incidentFormData.reportedTime.trim().length==0)){
    this.common.openSnackBar('Please enter reported time',2,'Required');
    return false;
  }else if((formFieldAccess.injurySustained.create || formFieldAccess.injurySustained.write) && (type=='Product') && (incidentFormData.injurySustained=='' || incidentFormData.injurySustained==null || incidentFormData.injurySustained.length==0)){
    this.common.openSnackBar('Please enter injury sustained',2,'Required');
    return false;
  }else if((formFieldAccess.circumstances.create || formFieldAccess.circumstances.write) && (type=='Product') && (incidentFormData.injuryCircumstances=='' || incidentFormData.injuryCircumstances==null || incidentFormData.injuryCircumstances.length==0)){
    this.common.openSnackBar('Please enter circumstances',2,'Required');
    return false;
  }else if((formFieldAccess.witnessAvailable.create || formFieldAccess.witnessAvailable.write) && (type!='Product') && (incidentFormData.witnessAvailable=='' || incidentFormData.witnessAvailable.trim().length==0)){
   this.common.openSnackBar('Please select witness available or not',2,'Required');
    return false;
  }else if((formFieldAccess.witnessAvailable.create || formFieldAccess.witnessAvailable.write) && (incidentFormData.witnessAvailable==true || incidentFormData.witnessAvailable=='true') && incidentFormData.witnessList.length==0){
    this.common.openSnackBar('Please enter atleast one witness details',2,'Required');
    return false;
  }else if((formFieldAccess.witnessAvailable.create || formFieldAccess.witnessAvailable.write) && (incidentFormData.witnessAvailable==true || incidentFormData.witnessAvailable=='true') && incidentFormData.witnessList.length>0 && deletescenariowitness == true){
    this.common.openSnackBar('Please enter atleast one witness details',2,'Required');
    return false;
  }else if((formFieldAccess.evidenceAvailable.create || formFieldAccess.evidenceAvailable.write) && (incidentFormData.evidenceAvailable=='' || incidentFormData.evidenceAvailable==null) ){
    this.common.openSnackBar('Please Select CCTV/Photos available or not',2,'Required');
    return false;
  }else if((formFieldAccess.evidenceAvailable.create || formFieldAccess.evidenceAvailable.write) && (incidentFormData.evidenceAvailable==true || incidentFormData.evidenceAvailable=='true') && incidentFormData.evidenceTakenBy.trim().length==0){
    this.common.openSnackBar('Please enter CCTV/Photos taken by name',2,'Required');
    return false;
  }else if((formFieldAccess.evidenceAvailable.create || formFieldAccess.evidenceAvailable.write) && (incidentFormData.evidenceAvailable==true  || incidentFormData.evidenceAvailable=='true') && (incidentFormData.noFootageAvailable=='' || incidentFormData.noFootageAvailable=='false') && noOFVideo==0){
    this.common.openSnackBar('One CCTV footage is mandatory',2,'Required');
    return false;
  }else if((formFieldAccess.evidenceAvailable.create || formFieldAccess.evidenceAvailable.write) && (incidentFormData.evidenceAvailable==true  || incidentFormData.evidenceAvailable=='true') && (incidentFormData.noFootageAvailable=='' || incidentFormData.noFootageAvailable=='false') && deletescenarioevidancevideo){
    this.common.openSnackBar('One CCTV footage is mandatory',2,'Required');
    return false;
  }
  else if((formFieldAccess.evidenceAvailable.create || formFieldAccess.evidenceAvailable.write) && (incidentFormData.evidenceAvailable==true || incidentFormData.evidenceAvailable=='true') && incidentFormData.evidences.length==0){
    this.common.openSnackBar('Please select atleast one CCTV/Photos',2,'Required');
    return false;
  }
  else if((formFieldAccess.evidenceAvailable.create || formFieldAccess.evidenceAvailable.write) && (incidentFormData.evidenceAvailable==true || incidentFormData.evidenceAvailable=='true') && incidentFormData.evidences.length>0 && deletescenarioevidance == true){
	this.common.openSnackBar('Please select atleast one CCTV/Photos',2,'Required');
    return false;
  }
  else if((formFieldAccess.productId.create || formFieldAccess.productId.write) && (type=='Product') && (incidentFormData.productId=='' || incidentFormData.productId.toString().trim().length==0)){
   this.common.openSnackBar('Please select product id or product description',2,'Required');
    return false;
  }
  else if((formFieldAccess.productAge.create || formFieldAccess.productAge.write) && (type=='Product') && (incidentFormData.productAge=='' || incidentFormData.productAge.toString().trim().length==0)){
   this.common.openSnackBar('Please enter product age',2,'Required');
    return false;
  }else if((formFieldAccess.ageType.create || formFieldAccess.ageType.write) && (type=='Product') && (incidentFormData.productAgeType=='' || incidentFormData.productAgeType.toString().trim().length==0)){
   this.common.openSnackBar('Please select product age (Weeks or Months or Years)',2,'Required');
    return false;
  }else if((type=='Product') && (incidentFormData.faultCode=='' || incidentFormData.faultCode.toString().trim().length==0)){
   this.common.openSnackBar('Please enter nature of product fault',2,'Required');
    return false;
  }else if((formFieldAccess.problemReportedBefore.create || formFieldAccess.problemReportedBefore.write) && (type=='Product') && (incidentFormData.problemReportedBefore=='' || incidentFormData.problemReportedBefore.toString().trim().length==0)){
   this.common.openSnackBar('Please enter problem reported before',2,'Required');
    return false;

  }else if((formFieldAccess.csdNumber.create || formFieldAccess.csdNumber.write) && (roleCode=='CS') && (type=='Product') && (incidentFormData.csdNumber=='' || incidentFormData.csdNumber.trim().length==0)){
   this.common.openSnackBar('Please enter CSD numbers',2,'Required');
    return false;
    
  }else if((formFieldAccess.handlers.create || formFieldAccess.handlers.write) && (roleCode=='CS') && (type=='Product') && (incidentFormData.handlingTeams=='' || incidentFormData.handlingTeams.length==0)){
   this.common.openSnackBar('Please select atleast one handling team',2,'Required');
    return false;
    
  }else if((formFieldAccess.priority.create || formFieldAccess.priority.write) && (type=='Product') && (incidentFormData.priorityCode=='' || incidentFormData.priorityCode.toString().trim().length==0)){
   this.common.openSnackBar('Please select priority',2,'Required');
    return false;
  }else{
    return true;
  }
}
evidenceValidate(control:any){
	if(control.value.length==0){
     return { 'message': 'Please select atleast one evidence' };
	}else{
   return null;
	}
}

reportedDateValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please select reported date' };
    }else{
    	return null;
    }
}
injurysustainValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please enter Injury sustained' };
    }else{
    	return null;
    }
}
circumstanceValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please enter cercumtances' };
    }else{
    	return null;
    }
}
problemreportedbeforeValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please enter problem reported before' };
    }else{
    	return null;
    }
}
faultCodeValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please enter nature of product fault' };
    }else{
    	return null;
    }
}
csdnumberValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please enter CSD tracking number' };
    }else{
    	return null;
    }
}
handlingTeamValidate(control:any){
	if(control.value.length==0){
    	 return  { 'message': 'Please select atleast one handling team' };
    }else{
    	return null;
    }
}
witnessAvailableValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please select witness Yes or No' };
    }else{
    	return null;
    }
}
evidenceAvailableValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please select CCTV/Photos Yes or No' };
    }else{
    	return null;
    }
}
productAgeValidate(control:any){
	let isValid = true;
	var Regex=/^[^a-zA-Z]*$/;
	let isSpecialCharValid=true;
	const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
	const result = specialChars.split('').some(specialChar => {
		if (control.value.includes(specialChar)) {
		isSpecialCharValid = false;
		return true;
		}
	return false;
	});
	
	if(control.value=='' || control.value==null){
		isValid = false;
    	 return  { 'message': 'Please enter product age' };
    }else if(!Regex.test(control.value))
	{
	isValid = false;
	return { 'message': 'Product age must not allow alphabets' };
	}else if(!isSpecialCharValid){
		isValid = false;
        return { 'message': 'Product age must not allow special characters' };
	}else{
    	return null;
    }
}
productAgeTypeValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'This field is mandatory' };
    }else{
    	return null
    }
}
priorityValidate(control:any){
	if(control.value=='' || control.value==null){
    	 return  { 'message': 'Please select priority' };
    }else{
    	return null
    }
}


}
