package com.accela.agencyTools.rest.agencyWizard.service;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.TimeZone;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.stereotype.Component;

import com.accela.aa.aamain.systemConfig.ServiceProviderModel;
import com.accela.aa.aamain.systemConfig.ServiceProviderService;
import com.accela.aa.client.cfm.EMSEClient;
import com.accela.aa.client.cfm.Result;
import com.accela.aa.emse.emse.ScriptRootService;
import com.accela.aa.emse.util.AAScriptSyntaxException;
import com.accela.aa.exception.AAException;
import com.accela.aa.util.EJBProxy;
import com.accela.agencyTools.WizardConstants;
import com.accela.agencyTools.exceptions.GithubAccessException;
import com.accela.agencyTools.rest.agencyWizard.entity.AgencyRequiredFieldModel;
import com.accela.agencyTools.rest.agencyWizard.entity.AgencyTimeZone;
import com.accela.agencyTools.rest.agencyWizard.entity.ResponseModel;
import com.accela.agencyTools.util.Resources;
import com.accela.agencyTools.util.WizardHelper;
import com.accela.util.AVContext;


/**
 * <pre>
 * 
 *  Accela Automation
 *  File: AgencyGenerationService.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: AgencyGenerationService.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 13, 2016		louis.he		Initial.
 *  	
 * </pre>
 */
@Component
@Path("/agency")
public class AgencyGenerationService
{
	
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseModel createAgency(@FormParam("servProvCode") String servProvCode,@FormParam("timeZone") String timeZone,
			@FormParam("multiLangFlag") String multiLangFlag,@FormParam("agencyName") String agencyName,
			@FormParam("address1") String address1,@FormParam("mainContact") String mainContact,@FormParam("city") String city,
			@FormParam("state") String state,@FormParam("licenseKey") String licenseKey,@FormParam("jurisdiction") String jurisdiction,
			@FormParam("zip") String zip,@FormParam("childAgency") String childAgency,
			@FormParam("activeSolutionsName") String activeSolutionsName,@FormParam("uid") String sessionId,@FormParam("selectedModules") String selectedModules)
	{
		ResponseModel res = new ResponseModel();
		try
		{
			res = validate(jurisdiction, agencyName, zip, state, city,address1,res);
			if(res.errorMsgs.size() > 0)
			{
				return res;
			}
			Hashtable table = new Hashtable();
			table.put("servProvCode", servProvCode);
			table.put("jurisdiction", jurisdiction);
			table.put("multiLangFlag",multiLangFlag);
			table.put("agencyName", agencyName);
			table.put("zip", zip);
			table.put("timeZone", timeZone);
			table.put("contactLine1", mainContact);
			table.put("address1", address1);
			table.put("state",state);
			table.put("city", city);
			table.put("licenseKey", license2Array(licenseKey));
			table.put("db", WizardConstants.DB);
			table.put("activeSolutionsName", activeSolutionsName);
			table.put("selectedModules", selectedModules);
			fillTable(table);
			String scriptText = Resources.getFileAsString(WizardConstants.CREATE_AGENCY_SCRIPT);
			Result emseBean = EMSEClient.getEMSEClient();
			EMSEClient client = (EMSEClient)emseBean.getOutput();
			Result result = client.testScript(scriptText, WizardConstants.LOGIN_AGENCY, table, WizardConstants.LOGIN_ADMIN, false);
			if(result.getSuccess()){
				Hashtable env = (Hashtable)result.getOutput();
				String scriptReturnCode = (String) env.get("ScriptReturnCode");
				if(scriptReturnCode != null && scriptReturnCode.equals("-1"))
				{
					res.addErrorMsg("Agency Wizard can not match with AA. Please modify wizard configuration to match them.");
					return res;
				}
				res.setStatus(true);
			}else{
				Object obj = result.getOutput();
				if(obj instanceof AAScriptSyntaxException){
					String errorString = ((AAScriptSyntaxException)obj).getStackTraceString();
					if(errorString.indexOf("unique constraint") != -1 || errorString.indexOf("Violation of PRIMARY KEY constraint") != -1){
						res.addErrorMsg("Duplicate agency code.");
					}else{
						res.addErrorMsg("System error, please contact system administrator.");
					}
					res.setStatus(false);
					return res;
				}
			}
			createDataManager(servProvCode,sessionId);
			res.setStatus(true);
		}
		catch (Exception e)
		{
			if(e instanceof GithubAccessException)
			{
				res.addErrorMsg("Can't connect to Github, please check your Network.");
			}
			res.setStatus(false);
		}
		return res;
	}
	
	private void createDataManager(String servProvCode,String sessionId) throws GithubAccessException
	{
		DataManagerService dataManager = new DataManagerService();
		dataManager.createDataManagerTask(servProvCode, WizardConstants.STANDARD_BASE_TASK_NAME, null, WizardConstants.DATA_IMPORT_POLICY_REJECT, servProvCode,null,sessionId);
	}
	
	private ResponseModel validate(String jurisdiction,String agencyName,String zip,String state,String city,String address1,ResponseModel rm)
	{
		if(jurisdiction.length() > 65){
			rm.addErrorMsg("Jurisdiction: Input length over 65 characters.");
		}
		if(agencyName.length() > 65){
			rm.addErrorMsg("Agency: Input length over 65 characters.");
		}
		if(zip.length() > 10){
			rm.addErrorMsg("Zip: Input length over 10 characters.");
		}
		if(city.length() > 30){
			rm.addErrorMsg("City: Input length over 30 characters.");
		}
		if(state.length() > 30){
			rm.addErrorMsg("State: Input length over 30 characters.");
		}
		if(address1.length() > 80){
			rm.addErrorMsg("Address: Input length over 80 characters.");
		}
		return rm;
	}
	
	/**
	 * 
	 * fill configuration to emse
	 *
	 * @param table
	 */
	public void fillTable(Hashtable table)
	{
		try{
			Properties props = Resources.getResourceAsProperties(WizardConstants.WIZARD_CONFIG);
			Iterator ite = props.keySet().iterator();
			while(ite.hasNext()){
				String key = (String)ite.next();
				table.put(key, props.get(key));
			}
		}catch(Exception e)
		{
			//TODO
		}
	}
	
	@GET
	@Path("/getTimeZone")
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseModel getTomeZones(){
		ResponseModel rsm = new ResponseModel();
		String timeZoneFixed = WizardHelper.getFromConfiguration("TimeZoneFixd");
		if(timeZoneFixed.equals(WizardConstants.FLAG_Y)){
			rsm.addField("timeZone", WizardHelper.timeZoneList);
		}else{
			String[] IDS = TimeZone.getAvailableIDs();
			List<AgencyTimeZone> list = new ArrayList<AgencyTimeZone>();
			for(String id : IDS)
			{
				String displayName = TimeZone.getTimeZone(id).getDisplayName();
				AgencyTimeZone timeZoneModel = new AgencyTimeZone(id,id + " | " + displayName);
				list.add(timeZoneModel);
			}
			rsm.addField("timeZone", list);
			}
		rsm.setStatus(true);
		return rsm;
	}
	
	/**
	 * 
	 * Check required field.
	 *
	 * @param servProvCode
	 * @param jurisdiction
	 * @param agencyName
	 * @param address1
	 * @param contactLine1
	 * @return
	 */
	@GET
	@Path("/require")
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseModel checkRequired(@QueryParam("servProvCode") String servProvCode, @QueryParam("jurisdiction") String jurisdiction,
			@QueryParam("agencyName") String agencyName, @QueryParam("address1") String address1,
			@QueryParam("contactLine1") String contactLine1)
	{
		ResponseModel rm = new ResponseModel();
		AgencyRequiredFieldModel arModel = new AgencyRequiredFieldModel(servProvCode,jurisdiction,agencyName,address1,contactLine1);
		if(arModel.validate())
		{
			rm.setStatus(true);
		}
		return rm;
	}
	
	/**
	 * 
	 * Check Agency.
	 * True: Agency is valid;
	 * False: Agency exists and invalid.
	 * @param servProvCode
	 * @return
	 */
	@GET
	@Path("/checkAgency")
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseModel checkAgencyCode(@QueryParam("servProvCode") String servProvCode,@QueryParam("newServProvCode") String newServProvCode)
	{
		ResponseModel rm = new ResponseModel();
		if(!servProvCode.equals(newServProvCode))
		{
			rm.addField("servProvCode","Agency doesn't match.");
		}else
		{
			rm.setStatus(true);
		}
		return rm;
	}
	
	/**
	 * Check if the agency exists
	 * @param servProvCode
	 * @return
	 * @throws RemoteException
	 * @throws AAException
	 */
	private boolean validateAgency(String servProvCode) throws RemoteException, AAException
	{
		ServiceProviderService spService = AVContext.getBean(ServiceProviderService.class);
		ServiceProviderModel spModel = spService.getServiceProviderByPK(servProvCode,WizardConstants.LOGIN_ADMIN);
		return (spModel == null) ? true : false;
	}
	
	public String[] license2Array(String licenseKey)
	{
		String[] licenseKeyData = new String[2];
		if(licenseKey.length() > 2500)
		{
			licenseKeyData[0] = licenseKey.substring(0, 2500);
			licenseKeyData[1] = licenseKey.substring(2500);
		}
		else
		{
			licenseKeyData[0] = licenseKey;
			licenseKeyData[1] = null;
		}
		return licenseKeyData;
	}
}

/*
*$Log: av-env.bat,v $
*/