
var solutionList = aa.env.getValue("solutions");
var servProvCode = aa.env.getValue("servProvCode");

getModuleNameBySolution();

function getModuleNameBySolution()
{
	
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var pst = null;
	var rSet = null;	
	try
	{
		var AA_VERSION_NBR_SQL = "SELECT AA_VERSION_NBR FROM RSERV_PROV A, AAVERSION B WHERE A.AARELEASE_VERSION=B.AA_VERSION ORDER BY AA_VERSION_NBR DESC";
		var aaVersionNBR = "";
		pst = conn.createStatement();
		rSet = pst.executeQuery(AA_VERSION_NBR_SQL);
		if(rSet.next()){
			aaVersionNBR = rSet.getString("AA_VERSION_NBR");
		}
		if(aaVersionNBR==""){
			aa.env.setValue("ScriptReturnCode","-1");
		}
		var sql = "SELECT amo.module_name, amo.solution_name FROM aaversion_module amo, aaversion av" +
				  " WHERE amo.aa_version_nbr = av.aa_version_nbr and amo.aa_version_nbr ="+aaVersionNBR+ " and amo.rec_status='A' and  amo.solution_name in ";

		var sqlVal = new Array();
		sqlVal = solutionList.split(",");
		sql = append(sql, sqlVal);
		pst = conn.prepareStatement(sql);
		rSet = pst.executeQuery();
		var solutionModuleMapping = aa.util.newHashMap();
		while (rSet.next()) {
			var solutionName = rSet.getString("solution_name");
			var moduleName = rSet.getString("module_name");
			var moduleList = solutionModuleMapping.get(solutionName);
			if(moduleList==null){
				moduleList = aa.util.newArrayList();
				solutionModuleMapping.put(solutionName, moduleList);
			} 
			moduleList.add(moduleName);
		}
		//return js value to java
		aa.env.setValue('rtSolutionMapping',solutionModuleMapping);

	}finally{
		closeDBQueryObject(rSet,pst,conn);
	}
}



/**
 * Prepare SQL
 * @param sql
 * @param array
 * @returns {String}
 */
function append(sql,array)
{
	if(array.length)
	{
		sql += " (";
		for(var i = 0; i < array.length;i++)
		{
			sql = sql + "'" + array[i] + "',";
		}
		sql = sql.substring(0,sql.length-1);
		sql += " )";
	}
	return sql;
}




function closeDBQueryObject(rSet, sStmt, conn) {                
	try {
			if(rSet) {
				rSet.close();
				rSet = null;
				aa.print("ResultSet is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database result set object." + vError);
	}
	
	try {
			if(sStmt){
				sStmt.close();
				sStmt = null;
				aa.print("Statement is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database prepare statement object." + vError);
	}
	
	try {
			if (conn) {
				conn.close();
				conn = null;
				aa.print("Connection is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database connection." + vError);
	}
}