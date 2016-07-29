getSolutionModuleMapping();
function getSolutionModuleMapping()
{
	
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var pst = null;
	var rSet = null;
	try
	{
		var reVal = getServProvNBR(conn);
		var sqlValue = new Array();
		//sqlValue.push();
		var sql = "SELECT amo.module_name, amo.solution_name FROM aaversion_module amo, aaversion av"
			+ " WHERE amo.aa_version_nbr = av.aa_version_nbr and amo.rec_status='A'";
		//sql = append(sql,sqlValue);
		pst = conn.prepareStatement(sql);
		rSet = pst.executeQuery();
	}finally{
		closeDBQueryObject(rSet,pst,conn);
	}
}


function getServProvNBR(conn) {
	var sql = "SELECT (rserv_prov_seq.nextval + 1000) as nex_val from dual";
	var reVal = "";
	try
	{
		var pst = conn.prepareStatement(sql);
		var rSet = pst.executeQuery();
		while (rSet.next()) {
			reVal = rSet.getString("nex_val");
			break;
		}
	}finally{
		safelyClose(rSet,pst);
	}
	return reVal;
}

function append(sql,array)
{
	if(array.length)
	{
		sql += " (";
		for(value in array)
		{
			sql = sql + '"' + value + '",';
		}
		sql = sql.substring(0,sql.length-1);
		sql += ' )';
	}
	return sql;
}

function safelyClose(rSet,pst)
{
	try{
		if(rSet){
			rSet.close();
			rSet = null;
		}
	}catch(err){
		aa.print("Failed to close the database result set object." + err);
	}
	try{
		if(pst){
			pst.close();
			pst = null;
		}
	}catch(err){
		aa.print("Failed to close the data base prepare statement object."+err);
	}
}
function closeDBQueryObject(rSet, sStmt, conn) 
{                
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

