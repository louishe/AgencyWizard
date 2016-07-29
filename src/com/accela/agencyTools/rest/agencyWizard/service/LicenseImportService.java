package com.accela.agencyTools.rest.agencyWizard.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.Converter;
import org.apache.commons.beanutils.locale.converters.DateLocaleConverter;
import org.apache.commons.digester.Digester;
import org.bouncycastle.crypto.engines.RSAEngine;
import org.bouncycastle.crypto.params.RSAKeyParameters;
import org.jboss.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.accela.aa.aamain.systemConfig.SystemConfigCacheHelper;
import com.accela.aa.client.cfm.EMSEClient;
import com.accela.aa.client.cfm.Result;
import com.accela.aa.emse.dom.ScriptResult;
import com.accela.aa.emse.emse.ScriptRootService;
import com.accela.aa.util.EJBProxy;
import com.accela.aa.util.ValidationUtil;
import com.accela.agencyTools.WizardConstants;
import com.accela.agencyTools.rest.agencyWizard.entity.LicenseKey;
import com.accela.agencyTools.rest.agencyWizard.entity.ResponseModel;
import com.accela.agencyTools.util.Resources;
import com.accela.av360.framework.util.CommonUtil;
import com.accela.productlicense.ProductlicenseModel;
import com.accela.productlicense.RequiredLicenseModel;
import com.accela.productlicense.SolutionModel;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: LicenseImportService.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: LicenseImportService.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 13, 2016		louis.he		Initial.
 *  
 * </pre>
 */
@Component
@Path("/license")
public class LicenseImportService
{
	
	public static final int MISSING = -1;
	public static final int EXPIRED = 0;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	private static final String pubMod = 
			"152798712454168822999610167346540583633504414059493905"
			+ "25430475076858057283940442575566251042960536205237436629221512294170223159323051634"
			+ "56770405836580628068867949114252013612113585409173498521254742678116341603255017185"
			+ "80749395902026174036336776186892609753471137493823915673779309896840073724385903570"
			+ "673217";

	private static final String pubExp = "3";

	private static final RSAEngine engine = new RSAEngine();
	
	private static final Map<String, String[]> SOLUTION_MODULE_MAPPING = new HashMap<String, String[]>();
	
	private static final Map<String, String> solutionSimpleFullNameMapping = new HashMap<String, String>();
	static
	{
		solutionSimpleFullNameMapping.put("AssetMgt", "Asset Management");
		solutionSimpleFullNameMapping.put("LandMgt", "Land Management");
		solutionSimpleFullNameMapping.put("LicenseCaseMgt", "License and Case Management");
		solutionSimpleFullNameMapping.put("PublicHealth", "Public Health and Safety");
		solutionSimpleFullNameMapping.put("SR", "Service Request");
		solutionSimpleFullNameMapping.put("RealEstateAcq", "Real Estate Acquisition(SFWMD)");

		// add-on
		solutionSimpleFullNameMapping.put("ACA", "Accela Citizen Access");
		solutionSimpleFullNameMapping.put("AGIS", "Accela GIS");
		solutionSimpleFullNameMapping.put("AW", "Accela Wireless");
		solutionSimpleFullNameMapping.put("AIVR", "Accela IVR");
		solutionSimpleFullNameMapping.put("AMO", "Accela Mobile Office");
	}
	
	static
	{
		RSAKeyParameters publicKeyCache = new RSAKeyParameters(false, new BigInteger(pubMod), new BigInteger(pubExp));
		engine.init(false, publicKeyCache);
	}
	
	private static final String GetUserCountScript = Resources.getFileAsString(WizardConstants.GET_USERCOUNT_4MODULE);
	
	@POST
	@Path("/viewLicense")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public ResponseModel viewLicense(@FormDataParam("file") InputStream file, @FormDataParam("fileName") String fileName)
	{
		ResponseModel rm = new ResponseModel();
		String licenseKey = getLicenseKey(file);
		rm.setObj(new LicenseKey(licenseKey));
		String licenseInfo = getLicenseInfo(licenseKey);
		ProductlicenseModel licenseModel = getLicenseModel(licenseInfo);
		if(CommonUtil.isEmpty(licenseModel.getAgency()))
		{
			rm.addErrorMsg(WizardConstants.INVALID_FILE);
			return rm;
		}
		String verifyResult = verify(licenseInfo, licenseModel.getLicensehash());
		if(!verifyResult.equals(WizardConstants.CORRECT_LICENSE)){
			rm.addErrorMsg(WizardConstants.INVALID_FILE);
			return rm;
		}
		rm.addField(WizardConstants.PRODUCT_LICENSE, licenseModel);
		Map<String, Integer> map = new HashMap<String, Integer>();
		if (licenseModel != null
				&& (!ValidationUtil.isEmpty(licenseModel.getSolutions()) 
				||	(!ValidationUtil.isEmpty(licenseModel.getAddons())))) 

		{
				List<SolutionModel> list = new ArrayList<SolutionModel>();
				list.addAll(licenseModel.getSolutions().values());
				list.addAll(licenseModel.getAddons().values());
				rm.addField(WizardConstants.LICENSE_SOLUTIONS, list);
				rm.addField(WizardConstants.ACTIVE_SOLUTIONS_NAME, filterActiveSolutions(list));
				String scriptText = Resources.getFileAsString(WizardConstants.GET_MODULE_NAMES);
				Hashtable table = new Hashtable();
				Map moduleNames = getModuleNames(table,scriptText);
				for(SolutionModel solution : list)
				{
					String solutionName = solution.getName();					
					List mnList = (List)moduleNames.get(solutionName);
					if(!ValidationUtil.isEmpty(mnList))
					{
						table = new Hashtable();
						table.put("modules", mnList);
						table.put("licensingAgency", licenseModel.getAgency());
						//no need to count the user. 
						int usedUsers = 0;//getUserCount(table,GetUserCountScript);
						map.put(solutionName, usedUsers);
					}
				}
				rm.addField("usedLicenses", map);
				rm.setStatus(true);
		}
		return rm;
	}
	

	@POST
	@Path("/getModuleBySolution")
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseModel getModuleSolution(@FormParam("servProvCode") String servProvCode,@FormParam("solutions") String solutions){
		
		ResponseModel rm = new ResponseModel();
		if(ValidationUtil.isEmpty(solutions) || solutions.split(",").length == 1)
		{
			rm.addErrorMsg("Fail to retrieve module list,or no active solutions.");
			rm.setStatus(false);
			return rm;
		}
		Hashtable table = new Hashtable();
		table.put("servProvCode", servProvCode);
		table.put("solutions", solutions);
		
		try{
			String getModuleScriptText = Resources.getFileAsString(WizardConstants.GET_MODULE_BY_SOLUTION);
			Map moduleNameSolutionMap = getModuleNames(table,getModuleScriptText);
			rm.addField("moduleNameSolutionMap", moduleNameSolutionMap);
			rm.setStatus(true);
			
		}catch(Exception e){
			
			rm.setStatus(false);
			rm.addErrorMsg("Fail to retrieve module list");
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
	
	
	
	
	public String filterActiveSolutions(List<SolutionModel> solutions)
	{
		StringBuilder sBuilder = new StringBuilder("");
		boolean flag = false;
		for(SolutionModel solution:solutions)
		{
			if(solution.isActive()){
				flag = true;
				sBuilder.append(solution.getName()).append(",");
			}
		}
		if(flag)
		{
			sBuilder.deleteCharAt(sBuilder.length()-1);
		}
		return sBuilder.toString();
	}
	
	/**
	 * 
	 * Execute script to get used user count.
	 * For this app, we can don't care the import license.
	 *
	 * @param table
	 * @param scriptText
	 * @return
	 */
	public int getUserCount(Hashtable table, String scriptText)
	{
		int usedUsers = 0;
		try{
			Result emseBean = EMSEClient.getEMSEClient();
			EMSEClient client = (EMSEClient)emseBean.getOutput();
			Result result = client.testScript(scriptText, "ADMIN", table, "ADMIN", false);
			if(result.getSuccess())
			{
				table = (Hashtable)result.getOutput();
				usedUsers = Integer.parseInt(table.get("usedUsers").toString());
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return usedUsers;
	}
	
	/**
	 * Execute script to get mapping.
	 *
	 * @param table
	 * @param scriptText
	 * @return
	 */
	public Map getModuleNames(Hashtable table,String scriptText)
	{
		Map moduleNames = new HashMap();
		try{
			Result emseBean = EMSEClient.getEMSEClient();
			EMSEClient client = (EMSEClient)emseBean.getOutput();
			Result result = client.testScript(scriptText, "ADMIN", table, "ADMIN", false);
			if(result.getSuccess()){
				table = (Hashtable)result.getOutput();
				moduleNames = (Map)table.get("rtSolutionMapping");
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return moduleNames;
	}
	
	public String getLicenseKey(InputStream file)
	{
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		int blockSize = 2048;
		byte[] buffer = new byte[blockSize];
		int bytesRead = 0;
		double totalBytesRead = 0;
		try
		{
			while ((bytesRead = file.read(buffer, 0, blockSize)) != -1)
			{
				byteArrayOutputStream.write(buffer, 0, bytesRead);
				totalBytesRead += bytesRead;
			}
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String licenseKey = byteArrayOutputStream.toString();
		return licenseKey;
	}
	
	/**
	 * Get License information.
	 *
	 * @param file
	 * @return
	 */
	public String getLicenseInfo(String licenseKey)
	{
		String plainKey = null;
		try{
			plainKey = new String(Base64.decode(licenseKey), "UTF-8");
		}
		catch(Exception e)
		{
			//TODO
		}
		return plainKey;
	}
	
	/**
	 * 
	 * Verify license info.
	 *
	 * @param inputPlainLicensingKey
	 * @param inputLicenseHash
	 * @return
	 */
	private String verify(String inputPlainLicensingKey, String inputLicenseHash)
	{
		byte[] decodedHash = Base64.decode(inputLicenseHash);
		byte[] decryptLicenseHash = decrypt(decodedHash);
		int licenseHashLen = decryptLicenseHash.length;
		byte[] plainLicenseHash = new byte[20];
		if(licenseHashLen < 20)
		{
			System.arraycopy(decryptLicenseHash, 0, plainLicenseHash, 20 - licenseHashLen, licenseHashLen);
		}
		else
		{
			plainLicenseHash = decryptLicenseHash;
		}
		byte[] licensehash = null;
		int begin = inputPlainLicensingKey.indexOf("<licensehash>");
		if (begin > 0)
		{
			begin += "<licensehash>".length();
			int end = inputPlainLicensingKey.indexOf("</licensehash>", begin);

			if (end > begin)
			{
				String inputLicensingKeyNoHash = inputPlainLicensingKey.substring(0, begin)
						+ inputPlainLicensingKey.substring(end);

				try
				{
					licensehash = SHA(inputLicensingKeyNoHash);
				}
				catch (Exception ex)
				{
					logger.debug("Fail to encrypt xml data", ex);
				}
			}
		}
		if (licensehash != null && inputLicenseHash != null && equals(licensehash, plainLicenseHash))
		{
			return WizardConstants.CORRECT_LICENSE;
		}
		else
		{
			return WizardConstants.WRONG_LICENSE;
		}
	}
	

	private boolean equals(byte[] b1, byte[] b2)
	{
		boolean equals = false;
		if (b1.length == b2.length)
		{
			equals = true;
			for (int i = 0; i < b1.length; i++)
			{
				if (b1[i] != b2[i])
				{
					equals = false;
					break;
				}
			}
		}
		return equals;
	}
	
	/**
	 * decrypt the license key.
	 * 
	 * @param values The encrypt byte array.
	 * @return 
	 */
	private byte[] decrypt(byte[] values)
	{
		try
		{
			return engine.processBlock(values, 0, values.length);
		}
		catch (Exception ex)
		{
			logger.debug("Fail to decrypt license hash", ex);
		}
		return null;
	}
	
	/**
	 * Encrypt the string by SHA.
	 * 
	 * @param text The text will be encrypt by SHA.
	 * @return 
	 */
	private byte[] SHA(String text) throws NoSuchAlgorithmException, UnsupportedEncodingException
	{
		MessageDigest md;
		md = MessageDigest.getInstance("SHA-1");
		byte[] textBytes = text.getBytes("utf-8");
		md.update(textBytes, 0, textBytes.length);
		byte[] sha1hash = md.digest();
		return sha1hash;
	}
	
	private ProductlicenseModel getLicenseModel(String key)
	{
		ProductlicenseModel licenseModel = new ProductlicenseModel();
		updateKey2LicensingModel(key,licenseModel);
		// -1 means inactive
		for (SolutionModel solution : licenseModel.getSolutions().values())
		{
			if (!solution.isActive())
			{
				solution.setNamedusers(MISSING);
			}
		}
		return licenseModel;
	}
	
	/**
	 * Convert plainKey to LicensingModel
	 * 
	 * @param key Key.
	 * @param model ProductlicenseModel.
	 * @return
	 */
	private void updateKey2LicensingModel(String key, ProductlicenseModel model)
	{
		try
		{
			Digester digester = new Digester();
			digester.setValidating(false);

			digester.addObjectCreate("productlicense", ProductlicenseModel.class);
			digester.addBeanPropertySetter("productlicense/agencyid", "agency");
			digester.addBeanPropertySetter("productlicense/masterkey", "masterKey");
			digester.addBeanPropertySetter("productlicense/masterexpirationdate", "masterExpirationdate");
			digester.addBeanPropertySetter("productlicense/licensehash", "licensehash");
			digester.addBeanPropertySetter("productlicense/comments", "comments");

			digester.addObjectCreate("productlicense/solutions/solution", SolutionModel.class);
			digester.addBeanPropertySetter("productlicense/solutions/solution/name", "name");
			digester.addBeanPropertySetter("productlicense/solutions/solution/namedusers", "namedusers");
			digester.addBeanPropertySetter("productlicense/solutions/solution/active", "active");
			digester.addBeanPropertySetter("productlicense/solutions/solution/expirationdate", "expirationdate");
			digester.addBeanPropertySetter("productlicense/solutions/solution/unlimitednamedusers",
				"unlimitednamedusers");
			digester.addSetNext("productlicense/solutions/solution", "addSolution");

			digester.addObjectCreate("productlicense/add-ons/add-on", SolutionModel.class);
			digester.addBeanPropertySetter("productlicense/add-ons/add-on/name", "name");
			digester.addBeanPropertySetter("productlicense/add-ons/add-on/namedusers", "namedusers");
			digester.addBeanPropertySetter("productlicense/add-ons/add-on/active", "active");
			digester.addBeanPropertySetter("productlicense/add-ons/add-on/expirationdate", "expirationdate");
			digester.addBeanPropertySetter("productlicense/add-ons/add-on/unlimitednamedusers", "unlimitednamedusers");
			digester.addSetNext("productlicense/add-ons/add-on", "addAddon");

			String pattern = "yyyy-MM-dd";
			Locale locale = Locale.getDefault();
			DateLocaleConverter converter = new DateLocaleConverter(locale, pattern);
			converter.setLenient(true);

			synchronized (ConvertUtils.class)
			{
				try
				{
					ConvertUtils.register(converter, java.util.Date.class);

					InputStream input = new ByteArrayInputStream(key.getBytes("UTF-8"));
					ProductlicenseModel parsed = (ProductlicenseModel) digester.parse(input);
					model.setAgency(parsed.getAgency());
					model.setMasterKey(parsed.isMasterKey());
					model.setMasterExpirationdate(parsed.getMasterExpirationdate());
					model.setLicensehash(parsed.getLicensehash());
					model.setSolutions(parsed.getSolutions());
					model.setAddons(parsed.getAddons());
					model.setComments(parsed.getComments());
				}
				finally
				{
					ConvertUtils.deregister(java.util.Date.class);
				}
			}
		}
		catch (Exception ex)
		{
			logger.error("Wrong xml data format", ex);
		}
	}

}

/*
*$Log: av-env.bat,v $
*/