package com.accela.agencyTools.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import com.accela.aa.util.ValidationUtil;
import com.accela.json.JSONException;
import com.sdicons.json.mapper.JSONMapper;
import com.sdicons.json.mapper.MapperException;
import com.sdicons.json.mapper.helper.impl.ArrayMapper;
import com.sdicons.json.model.JSONValue;
import com.sdicons.json.parser.JSONParser;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: JsonUtil.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: JsonUtil.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 14, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class JsonUtil
{

	private static ArrayMapper arryMapper = new ArrayMapper();
	/**
	 * change model to JSON
	 * 
	 * @param clazz class object
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T toModel(String json, Class<T> clazz) throws JSONException
	{
		if (ValidationUtil.isEmpty(json))
		{
			return null;
		}
		JSONParser parser = new JSONParser(new StringReader(json));
		
		T instance = null;
		try
		{
			instance = (T) JSONMapper.toJava(parser.nextValue(), clazz);
		}
		catch (Exception e)
		{
			throw new JSONException("Convert JSON to model failed.", e);
		}
		return instance;
	}

	/**
	 * change JSON to model
	 * 
	 * @param json
	 * @param clazz
	 * @return
	 */
	public static <T> String toJson(T obj) throws JSONException
	{
		if (obj == null)
		{
			return "";
		}
		
		String json = "";
		
		try
		{
			JSONValue jsonValue = JSONMapper.toJSON(obj);
			if (jsonValue != null)
			{
				json = jsonValue.render(false);
			}				
		}
		catch (MapperException e)
		{
			throw new JSONException("Convert model to JSON failed.", e);
		}

		return json;
	}
	
	/**
	 * To model list.
	 * 
	 * @param json 	the JSON string
	 * @param clazz the class type
	 * 
	 * @return the list<T>
	 */
	public static <T> List<T> toModelList(String json, Class<T> clazz) throws JSONException
	{
		if (ValidationUtil.isEmpty(json))
		{
			return null;
		}
		JSONParser parser = new JSONParser(new StringReader(json));

		List<T> instance = null;
		try
		{
			T[] result = (T[]) arryMapper.toJava(parser.nextValue(), clazz);
			if (result != null)
			{
				instance = new ArrayList<T>();
				for (T t : result)
				{
					instance.add(t);
				}
			}
		}
		catch (Exception e)
		{
			throw new JSONException("Convert JSON to model failed.", e);
		}
		return instance;
	}
}

/*
*$Log: av-env.bat,v $
*/