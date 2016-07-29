package com.accela.agencyTools.rest.agencyWizard.service;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: AuthenticationService.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: AuthenticationService.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 12, 2016		louis.he		Initial.
 *  
 * </pre>
 */

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.accela.aa.util.Product;
import com.accela.aa.util.UserType;
import com.accela.agencyTools.WizardConstants;
import com.accela.agencyTools.rest.agencyWizard.entity.ResponseModel;
import com.accela.agencyTools.rest.agencyWizard.entity.UserToken;
import com.accela.agencyTools.util.Resources;
import com.accela.security.UserSession;
import com.accela.security.client.SecurityAuthenticationClient;
import com.accela.util.AVProperties;

@Component
@Path("/user")
public class AuthenticationService
{
	/**
	 * 
	 * User authenticate.
	 * @param user
	 * @return
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/authenticate")
	public ResponseModel auth(@FormParam("userId") String userId,@FormParam("agencyCode") String agencyCode, @FormParam("password")String password)
	{
		ResponseModel rm = new ResponseModel();
		UserSession userSess = null;
		try
		{
			SecurityAuthenticationClient sAuthClient = new SecurityAuthenticationClient(AVProperties.getProperty("java.naming.provider.url"));
			String systemID = AVProperties.getProperty(WizardConstants.SSO_SYSTEM_ID);
			userSess = sAuthClient.newSignon(UserType.AGENCY_USER,userId.toUpperCase(), password, systemID, WizardConstants.DOMAIN,agencyCode.toUpperCase(), Product.AV360.toString(), null);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		try
		{
			UserToken token = new UserToken();
			BeanUtils.copyProperties(userSess, token);
			rm.setStatus(true);
			rm.setObj(token);
		}
		catch (Exception e)
		{
			rm.addErrorMsg("The password is incorrect.");
			rm.setStatus(false);
		}
		return rm;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getUser")
	public ResponseModel getDefaultUser()
	{
		ResponseModel rm = new ResponseModel();
		try
		{
			Properties props = Resources.getResourceAsProperties(WizardConstants.WIZARD_CONFIG);
			String agency = props.getProperty("agency");
			String userId = props.getProperty("userId");
			String password = props.getProperty("password");
			List list = new ArrayList();
			list.add(agency);
			list.add(userId);
			list.add(password);
			rm.addField("user", list);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return rm;
	}
	
}

/*
*$Log: av-env.bat,v $
*/