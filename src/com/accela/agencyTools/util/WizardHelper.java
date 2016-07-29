package com.accela.agencyTools.util;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import com.accela.adapter.util.StringUtil;
import com.accela.agencyTools.WizardConstants;
import com.accela.agencyTools.exceptions.GithubAccessException;
import com.accela.agencyTools.rest.agencyWizard.entity.AgencyTimeZone;
import com.accela.agencyTools.rest.agencyWizard.entity.StandardBaseModel;
import com.accela.agencyTools.rest.agencyWizard.task.FileProgressHolder;
import com.accela.util.AVProperties;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: WizardHelper.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: WizardHelper.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 23, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class WizardHelper
{
	
	public static List<AgencyTimeZone> timeZoneList = new ArrayList<AgencyTimeZone>();
	
	static {
		timeZoneList.add(new AgencyTimeZone("GMT-12:00", "(GMT-12:00) International Date Line West"));
		timeZoneList.add(new AgencyTimeZone("GMT-11:00", "(GMT-11:00) Midway Island, Samoa"));
		timeZoneList.add(new AgencyTimeZone("GMT-10:00", "(GMT-10:00) Hawaii"));
		timeZoneList.add(new AgencyTimeZone("GMT-08:00", "(GMT-08:00) Pacific Time (US & Canada); Tijuana"));
		timeZoneList.add(new AgencyTimeZone("GMT-07:003", "(GMT-07:00) Mountain Time (US & Canada)"));
		timeZoneList.add(new AgencyTimeZone("GMT-06:002", "(GMT-06:00) Central Time (US & Canada)"));
		timeZoneList.add(new AgencyTimeZone("GMT-05:002", "(GMT-05:00) Eastern Time (US & Canada)"));
		timeZoneList.add(new AgencyTimeZone("GMT-04:001", "(GMT-04:00) Atlantic Time (Canada)"));
		timeZoneList.add(new AgencyTimeZone("GMT-03:30", "(GMT-03:30) Newfoundland"));
		timeZoneList.add(new AgencyTimeZone("GMT-03:002", "(GMT-03:00) Buenos Aires,Georgetown"));
		timeZoneList.add(new AgencyTimeZone("GMT-02:00", "(GMT-02:00) Mid-Atlantic"));
		timeZoneList.add(new AgencyTimeZone("GMT+00:001", "(GMT) Greenwich Mean Time : Dublin,Edinburgh,Lisbon,London"));
		timeZoneList.add(new AgencyTimeZone("GMT+01:001", "(GMT+01:00) Amsterdam,Berlin,Bern,Rome,Stockholm,Vienna"));
		timeZoneList.add(new AgencyTimeZone("GMT+02:001", "(GMT+02:00) Athens,Beirut,Istanbul,Minsk"));
		timeZoneList.add(new AgencyTimeZone("GMT+03:002", "(GMT+03:00) Kuwait,Riyadh"));
		timeZoneList.add(new AgencyTimeZone("GMT+04:001", "(GMT+04:00) Abu Dhabi,Muscat"));
		timeZoneList.add(new AgencyTimeZone("GMT+07:001", "(GMT+07:00) Bangkok,Hanoi,Jakarta"));
		timeZoneList.add(new AgencyTimeZone("GMT+08:001", "(GMT+08:00) Beijing,Chongqing,Hong Kong,Urumqi"));
		timeZoneList.add(new AgencyTimeZone("GMT+08:003", "(GMT+08:00) Kuala Lumpur,Singapore"));
		timeZoneList.add(new AgencyTimeZone("GMT+09:001", "(GMT+09:00) Osaka,Sapporo,Tokyo"));
		timeZoneList.add(new AgencyTimeZone("GMT+10:002", "(GMT+10:00) Canberra,Melbourne,Sydney"));
		timeZoneList.add(new AgencyTimeZone("GMT+11:00", "(GMT+11:00) Magadan,Solomon Is.,New Caledonia"));
		timeZoneList.add(new AgencyTimeZone("GMT+12:001", "(GMT+12:00) Auckland,Wellington"));
	}
	
	public static String getFromConfiguration(String key)
	{
		try
		{
			Properties props = Resources.getResourceAsProperties(WizardConstants.WIZARD_CONFIG);
			return (String)props.get(key);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return "";
	}
	
	/**
	 * Get compressed ZIP file.
	 *
	 * @param agencyCode
	 * @return
	 */
	public static File getCompressedFile(String url,String fileName) throws GithubAccessException
	{
		download(url);
		unZipFiles();
		return combineFiles(fileName);
	}
	
	/**
	 * 
	 * Download zip files
	 *
	 * @param models
	 * @param agencyCode
	 * @throws Exception
	 */
	public static void download(String url) throws GithubAccessException
	{
		List<StandardBaseModel> list = getRefStandardBaseData(url);
		Map<String,String> fileMap = new HashMap<String,String>();
		for(StandardBaseModel model : list)
		{
			if(StringUtil.isNotEmpty(model.getDownload_url()) && !model.getName().equals(WizardConstants.EXCULEDED_FILE))
			{
				fileMap.put(model.getName(),model.getDownload_url());
			}
		}
		Iterator<String> ite = fileMap.keySet().iterator();
		while(ite.hasNext())
		{
			String fileName = ite.next();
			String downloadURL = fileMap.get(fileName);
			InputStream in = getFileReader(downloadURL);
			getFileFromInputStream(in, getTempFileName(fileName));
		}
	}
	
	/**
	 * 
	 * Compress into a zip file.
	 *
	 * @param agencyCode
	 */
	public static File combineFiles(String fileName)
	{
		File file = new File(WizardConstants.PREFIX_IMPORT_FILE_NAME);
		File zipFile = new File(fileName);//(WizardConstants.STANDARD_BASE_IMPORT_FILE);
		if (file.exists() && file.isDirectory())
		{
			File[] files = file.listFiles(new FileFilter()
			{
				public boolean accept(File pathname)
				{
					if (pathname.getName().endsWith(".xml"))
					{
						return true;
					}
					return false;
				}
			});
			try
			{
				ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipFile));
				InputStream in = null;
				int size = 0;
				for (File xmlFile : files)
				{
					in = new FileInputStream(xmlFile);
					zipOut.putNextEntry(new ZipEntry(xmlFile.getName()));
					while((size = in.read()) != -1)
					{
						zipOut.write(size);
					}
					in.close();
				}
				zipOut.close();
			}
			catch (Exception e)
			{
				// error handle.
			}
		}
		return zipFile;
	}
	
	/**
	 * 
	 * Unzip zip files.
	 *
	 * @param agencyCode
	 */
	public static void unZipFiles()
	{
		File file = new File(WizardConstants.PREFIX_IMPORT_FILE_NAME);
		if(file.exists() && file.isDirectory()){
			File[] files = file.listFiles();
			ZipFile zipFile = null;
			try
			{
				InputStream inputStream = null;
				for(File tmpFile : files)
				{
					zipFile = new ZipFile(tmpFile);
					Enumeration<?> enumeration = zipFile.entries();
					while (enumeration.hasMoreElements())
					{
						ZipEntry entry = (ZipEntry) enumeration.nextElement();
						inputStream = zipFile.getInputStream(entry);
						getFileFromInputStream(inputStream,getTempFileName(entry.getName()));//agencyCode
					}
				}
			}
			catch(Exception e)
			{
				//Unzip file error.
			}
			finally{
				if(null != zipFile)
				{
					try
					{
						zipFile.close();
					}
					catch (IOException e)
					{
						//Close zip file error.
					}
				}
			}
		}
	}
	
	/**
	 * 
	 * Store the downloaded files.
	 *
	 * @param agencyCode
	 * @param fileName
	 * @return
	 */
	public static String getTempFileName(String fileName)
	{
		String fname = "";
		StringBuilder exportFileName = new StringBuilder();
		exportFileName.append(WizardConstants.PREFIX_IMPORT_FILE_NAME);//WizardConstants.PREFIX_IMPORT_FILE_NAME
		exportFileName.append(File.separatorChar);
		exportFileName.append(fileName);
		fname = exportFileName.toString();
		checkFilePath(fname);
		return fname;
	}
	
	/**
	 * 
	 * Check if the dir exists, if not, create.
	 *
	 * @param checkFile
	 * @return
	 */
	public static boolean checkFilePath(String checkFile)
	{
		boolean create = false;
		File file = new File(checkFile);
		File path = new File(file.getParent());
		if (!path.exists())
		{
			create = path.mkdirs();
		}
		return create;
	}
	
	/**
	 * 
	 * Get Standard Base model from Git URL
	 *
	 * @return
	 * @throws Exception
	 */
	public static List<StandardBaseModel> getRefStandardBaseData(String url) throws GithubAccessException
	{
		List<StandardBaseModel> standardBases = null;
		try
		{
			InputStream in = getFileReader(url);
			String json = read(in);
			Class baseClass = Class.forName("com.accela.agencyTools.rest.agencyWizard.entity.StandardBaseModel");
			standardBases = JsonUtil.toModelList(json, baseClass);
		}
		catch(Exception e)
		{
			if(e instanceof GithubAccessException)
			{
				throw new GithubAccessException(e);
			}
		}
		return standardBases;
	}
	
	/**
	 * 
	 * Open connection of standard base url
	 *
	 * @param httpURL
	 * @return
	 * @throws Exception
	 */
	public static InputStream getFileReader(String gitURL) throws GithubAccessException
	{
		InputStream in = null;
		try
		{
			URL url = null;
			if(null == gitURL)
			{
				url = new URL(WizardConstants.REF_STANDARDBASE_URL);
			}
			else
			{
				url = new URL(gitURL);
			}
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setReadTimeout(60000);
			connection.setUseCaches(false);
			connection.setConnectTimeout(60000);
			in = connection.getInputStream();
		}
		catch(Exception e)
		{
			throw new GithubAccessException(e);
		}
		return in;
	}
	
	/**
	 * 
	 * Store zip file from Standard base Git URL.
	 *
	 * @param inStream
	 * @param outputFile
	 * @return
	 * @throws Exception
	 */
	public static File getFileFromInputStream(InputStream inStream, String outputFile)
	{
		OutputStream outStream = null;
		File file = null;
		try
		{
			file = new File(outputFile);
			FileOutputStream fstream = new FileOutputStream(file);
			outStream = new BufferedOutputStream(fstream);
			
			int n = 0;
			byte[] b = new byte[4096];
			while ((n = inStream.read(b)) != -1)
			{
				outStream.write(b, 0, n);
				outStream.flush();
			}
		}
		catch (Exception e)
		{
			//
		}
		finally
		{
			if (outStream != null)
			{
				try
				{
					outStream.close();
				}
				catch (IOException e)
				{
					//
				}
			}
		}
		return file;
	}
	
	/**
	 * 
	 * Read buffer.
	 *
	 * @param in
	 * @return
	 * @throws IOException
	 */
	public static String read(InputStream in) throws IOException
	{
		BufferedReader reader = new BufferedReader(new InputStreamReader(in));
		StringBuffer buffer = new StringBuffer();
		String str;
		while((str = reader.readLine()) != null)
		{
			buffer.append(str);
		}
		return buffer.toString();
	}
	
	/**
	 * Check file status. If fetching, wait.
	 * TODO.
	 *
	 */
	public static void waittingFileDone()
	{
		boolean flag = true;
		while(flag)
		{
			if(FileProgressHolder.getInstance().getFileStatus().getStatus().equals(WizardConstants.FILE_DONE))
			{
				flag = false;
			}
			try
			{
				Thread.sleep(new Long(200));
			}
			catch (InterruptedException e)
			{
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 
	 * Call datamanager task webservice.
	 *
	 * @param file
	 * @param agencyCode
	 * @param taskName
	 * @param fileName
	 * @param sessionId
	 */
	public static void postStream(File file,String agencyCode,String taskName,String fileName,String sessionId)
	{
		MultipartEntity multipartEntity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE,"----------This is the boundary_$", Charset.defaultCharset());
		try
		{
			multipartEntity.addPart("fileContent",new FileBody(file,"application/zip"));
			multipartEntity.addPart("taskName",new StringBody(taskName));
			multipartEntity.addPart("fileName",new StringBody(fileName));
			multipartEntity.addPart("serviceProviderCode",new StringBody(agencyCode));
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		String uploadURL = WizardConstants.DATA_MANAGER_ENDPOINT  + "/task/upload";
		HttpPost request = new HttpPost(uploadURL);
		request.setEntity(multipartEntity);
		request.addHeader(new BasicHeader("Cookie",getSecurityCookie(WizardConstants.SSO_COOKIE,sessionId)));
		request.addHeader("Content-Type","multipart/form-data; boundary=----------This is the boundary_$");
		DefaultHttpClient httpClient = new DefaultHttpClient();
		try
		{
			HttpResponse response = httpClient.execute(request);
			int status = response.getStatusLine().getStatusCode();
			if(status == 200)
			{
				// run data manager task.
				runDataManagerTask(agencyCode,taskName,sessionId);
			}
		}
		catch (ClientProtocolException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void runDataManagerTask(String servProvCode,String taskName,String sessionId)
	{
		String url = WizardConstants.DATA_MANAGER_ENDPOINT + "/task/run?serviceProviderCode="+servProvCode+"&taskName="+taskName;
		HttpPut request = new HttpPut(url);
		request.setHeader(new BasicHeader("Cookie",getSecurityCookie(WizardConstants.SSO_COOKIE,sessionId)));
		DefaultHttpClient httpClient = new DefaultHttpClient();
		try
		{
			HttpResponse response = httpClient.execute(request);
			int status = response.getStatusLine().getStatusCode();
			if(status == 200)
			{
				// run data manager task.
			}
		}
		catch (ClientProtocolException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * Add cookie.
	 *
	 * @param cookieName
	 * @param ssoid
	 * @return
	 */
	public static String getSecurityCookie(String cookieName,String ssoid)
	{
		StringBuilder cookieSb = new StringBuilder();
		cookieSb.append(cookieName);
		cookieSb.append("=");
		cookieSb.append(ssoid);
		cookieSb.append(";");
		cookieSb.append("path=");
		cookieSb.append("/");
		cookieSb.append(";");
		cookieSb.append("Domain=");
		cookieSb.append(AVProperties.getProperty(WizardConstants.COOKIE_DOMAIN));
		cookieSb.append(";Secure;HttpOnly");
		return cookieSb.toString();
	}
	
	public static int copy(final InputStream input, final OutputStream output, int bufferSize) throws IOException
	{
		int avail = input.available();
		if (avail > 262144)
		{
			avail = 262144;
		}
		if (avail > bufferSize)
		{
			bufferSize = avail;
		}
		final byte[] buffer = new byte[bufferSize];
		int n = 0;
		n = input.read(buffer);
		int total = 0;
		while (-1 != n)
		{
			if (n == 0)
			{
				throw new IOException("0 bytes read in violation of InputStream.read(byte[])");
			}
			output.write(buffer, 0, n);
			total += n;
			n = input.read(buffer);
		}
		return total;
	}
	
//	
//	public static void downloadTest() throws Exception
//	{
//		download();
//		unZipFiles();
//		File file = combineFiles();
//		System.out.println(file.getName());
//	}
//	
//	public static void main(String[] args) throws Exception
//	{
//		//downloadTest();
//		
//		File file = new File("D:\\BugReport.txt");
//		//postStream(file);
//		//readToCachedStream(file);
//	}
	
	
}

/*
*$Log: av-env.bat,v $
*/