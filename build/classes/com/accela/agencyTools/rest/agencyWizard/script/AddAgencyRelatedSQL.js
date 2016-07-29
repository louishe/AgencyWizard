--L154 AddNew
--<CFQUERY	DATASOURCE="#Application.ODS_DATASOURCE#"
--	NAME="AddNew"
	
	
INSERT INTO RSERV_PROV(ADDRESS1,ADDRESS2,APO_SRC_SEQ_NBR,
		CITY,CONTACT_LINE1,CONTACT_LINE2,GRAPHIC_PATH,LAST_RECIEPT_NBR, 
		NAME,NAME2,REC_DATE,REC_FUL_NAM,REC_LOCK,REC_SECURITY,
		REC_STATUS,SERV_PROV_CODE,STATE,ZIP, LAST_INVOICE_NBR, LAST_PROJECT_NBR,
		LAST_SET_ID,SET_ID_PREFIX,DEF_NBR_SCHEME_FLG

		,SERV_PROV_NBR

		,AARELEASE_VERSION
		,TIME_ZONE, DAYLIGHT_SAVING, SPECIAL_HANDLE
		--To Disable User Account & Force User to Change Password
		,ACCOUNT_DISABLE_PERIOD, PASSWORD_EXPIRE_TIMEFRAME, ALLOW_USER_CHANGE_PASSWORD
		,IS_PACKAGED_SOLUTION


--L211 AddNew
INSERT INTO RSERV_PROV(ADDRESS1,ADDRESS2,APO_SRC_SEQ_NBR,
		CITY,CONTACT_LINE1,CONTACT_LINE2,GRAPHIC_PATH,LAST_RECIEPT_NBR, 
		NAME,NAME2,REC_DATE,REC_FUL_NAM,REC_LOCK,REC_SECURITY,
		REC_STATUS,SERV_PROV_CODE,STATE,ZIP, LAST_INVOICE_NBR,
		LAST_SET_ID,SET_ID_PREFIX,AARELEASE_VERSION,IS_PACKAGED_SOLUTION)									
		VALUES



--L235 qry_GportletStandardDataInsert
 INSERT INTO GPORTLET ( PORTLET_ID, PORTLET_DES, PORTLET_URL, PORTAL_PAGE_ID, FID, REC_STATUS, 
		REC_FUL_NAM, REC_DATE, PORTLET_ICON, SERV_PROV_CODE)
		SELECT G.PORTLET_ID, G.PORTLET_DES, G.PORTLET_URL, G.PORTAL_PAGE_ID, G.FID, G.REC_STATUS, 
		G.REC_FUL_NAM, G.REC_DATE, G.PORTLET_ICON, '#Ucase(attributes.txtSERV_PROV_CODE)#'
		FROM GPORTLET G WHERE SERV_PROV_CODE = 'STANDARDDATA'


--Information of the server constants for an agency.

--L245 Add_PrintPermitStyle
--<CFQUERY NAME="EnableAppName"
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
		rec_date,rec_ful_nam,rec_status)
		VALUES(<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
		'PRINTPERMITSTYLE',<CFQUERYPARAM VALUE="#attributes.rbPermitStyle#" CFSQLTYPE="CF_SQL_VARCHAR">,'PrintStyle',
		sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')

--Add_PayBeforePrint , Add_BlockNonWorkDay , Add_MultipleResult , Add_SpecialAddressModel, Add_WorkflowAssignTaskDateFromDefaultValue,EnableAppName

-- EnableAuditName , EnableContactSnapshotName, EnableAuditName4GuideSheet, ENABLE_AUDIT_CONDITION, ENABLE_AUDIT_REF_CONDITION

-- ENABLE_AUDIT_STD_CONDITION, ENABLE_AUDIT_DOCUMENT, ENABLE_AUDIT_EXAMINATION, ENABLE_AUDIT_ASSET, EnableContactSnapshotName

--Add_EMailHyperlink, Add_CommasNumericFormat




--add ad_hoc_multi_source seqenuce number  name=Insert_Ad_Hoc_Multi_Agencies_seq_insert
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
		rec_date,rec_ful_nam,rec_status)
		VALUES('#Ucase(attributes.txtSERV_PROV_CODE)#','#vAd_Hoc_Multi_Agencies_seq_constant_name#', '#vAd_Hoc_Multi_Agencies_seq#','#vAgenciesSeqList#',
		sysdate,'#session.uname#','A')

--name = Add_BIZDOMAINFindAppDateRange

INSERT INTO	RBIZDOMAIN(
			SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,
			REC_DATE,REC_FUL_NAM,REC_STATUS)
		VALUES(
			<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" 
			CFSQLTYPE="CF_SQL_VARCHAR">,'Find App Date Range','Find App Date Range',30,sysdate,
			<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A'



--name = Update_BIZDOMAIN_VALUEFindAppDateRange
UPDATE 	RBIZDOMAIN_VALUE
		SET		
		BIZDOMAIN_VALUE=<CFQUERYPARAM VALUE="#attributes.FindAppDateRange#" CFSQLTYPE="CF_SQL_VARCHAR">,
		REC_DATE = SYSDATE,
		REC_FUL_NAM = <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR"> 
		WHERE  	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		UPPER(BIZDOMAIN) ='FIND APP DATE RANGE'
		AND 	REC_STATUS = 'A'



--name= Add_HearBodyBizDomain
INSERT INTO RBIZDOMAIN (BIZDOMAIN, DEFAULT_VALUE, DESCRIPTION, 
					REC_DATE, REC_FUL_NAM, REC_STATUS, 
					SERV_PROV_CODE, VALUE_SIZE)
		VALUES ('HEARING BODY', '', 'Hearing Body',
		SYSDATE, <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">, 'A',
		<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">, 40)


-- name = Add_HearLocationBizDomain
INSERT INTO RBIZDOMAIN (BIZDOMAIN, DEFAULT_VALUE, DESCRIPTION, 
					REC_DATE, REC_FUL_NAM, REC_STATUS, 
					SERV_PROV_CODE, VALUE_SIZE)
		VALUES ('HEARING LOCATION', '', 'Hearing Location',
		SYSDATE, <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">, 'A',
		<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">, 45)


-- name = Add_Rpayment_Period_Adjustment
INSERT INTO RPAYMENT_PERIOD(SERV_PROV_CODE,GF_FEE_PERIOD,DISPLAY_ORDER,REC_STATUS,
									REC_DATE,REC_FUL_NAM)
		VALUES(<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,'ADJUSTMENT',0, 'A',
				sysdate, <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">)



---Create admin user for agency 
-- name = qry_UserMnInsert

INSERT INTO PUSER (SERV_PROV_CODE, USER_NAME, PASSWORD,
		DISP_NAME, STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS, GA_USER_ID)
		VALUES	('#Ucase(attributes.txtSERV_PROV_CODE)#','ADMIN', 'd033e22ae348aeb5660fc2140aec35850c4da997',
		'ADMIN','ENABLE', SYSDATE, '#session.uname#', 'A','ADMIN')


-- name = qry_G3STAFFS_Insert
INSERT INTO G3STAFFS(SERV_PROV_CODE, GA_USER_ID, GA_AGENCY_CODE, 
			GA_BUREAU_CODE, GA_DIVISION_CODE, GA_GROUP_CODE, GA_OFFICE_CODE, GA_SECTION_CODE,
			USER_NAME, REC_DATE, REC_FUL_NAM, REC_STATUS)
		VALUES	('#Ucase(attributes.txtSERV_PROV_CODE)#','ADMIN', 'NA',
			'NA', 'NA', 'NA', 'NA', 'NA', 
			'ADMIN', SYSDATE, '#session.uname#', 'A')


-- name = Add_Module
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
		rec_date,rec_ful_nam,rec_status)
		VALUES(<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
		<CFQUERYPARAM VALUE="#TT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">,
		<CFQUERYPARAM VALUE="#isYes#" CFSQLTYPE="CF_SQL_VARCHAR">,'Module',
		sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')



--Add FULL access FIDS
-- name = qry_AgencyMenuItemInsert
INSERT INTO PPROV_MENUITEM_MODULE( serv_prov_code,module_name, menuitem_code, 
			status, read_stat, edit_stat, add_stat, del_stat, rec_date,
			rec_ful_nam, rec_status, DISP_STAT)
		SELECT '#Ucase(attributes.txtSERV_PROV_CODE)#','#TT_MODULE_NAME#', AM.menuitem_code, 
			'ENABLE','Y', 'Y', 'Y', 'Y', sysdate,
			'#session.uname#', 'A', 'N'
		FROM   RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
		WHERE  V.AA_VERSION_NBR = A.AA_VERSION_NBR
		AND    V.AA_VERSION_NBR = AM.AA_VERSION_NBR
		AND    AM.MENUITEM_CODE = R.MENUITEM_CODE
		AND    A.MODULE_ALIAS = AM.MODULE_NAME
		AND    V.REC_STATUS = 'A'
		AND    A.REC_STATUS = 'A'
		AND    AM.REC_STATUS = 'A'
		AND    R.REC_STATUS = 'A'
		AND    R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND    V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND    A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND    AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND	   UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND	  (UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="BASIC" CFSQLTYPE="CF_SQL_VARCHAR">
		    OR UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="F" CFSQLTYPE="CF_SQL_VARCHAR">)

-- Add Read Only access FIDS
-- name = qry_AgencyMenuItemInsert
INSERT INTO PPROV_MENUITEM_MODULE( serv_prov_code,module_name, menuitem_code, 
			status,read_stat, edit_stat, add_stat, del_stat, rec_date,
			rec_ful_nam, rec_status, DISP_STAT)
		SELECT '#Ucase(attributes.txtSERV_PROV_CODE)#','#TT_MODULE_NAME#', AM.menuitem_code, 
			'ENABLE','Y', 'N', 'N', 'N', sysdate,
			'#session.uname#', 'A', 'N'
		FROM  RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
		WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR
		AND   V.AA_VERSION_NBR = AM.AA_VERSION_NBR
		AND   AM.MENUITEM_CODE = R.MENUITEM_CODE
		AND   A.MODULE_ALIAS = AM.MODULE_NAME
		AND   V.REC_STATUS = 'A'
		AND   A.REC_STATUS = 'A'
		AND   AM.REC_STATUS = 'A'
		AND   R.REC_STATUS = 'A'
		AND   R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND   V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND   A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND   AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND   UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND   UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="R" CFSQLTYPE="CF_SQL_VARCHAR">		 


--Add NONE access FIDS
-- name = qry_AgencyMenuItemInsert
INSERT INTO PPROV_MENUITEM_MODULE( serv_prov_code,module_name, menuitem_code, 
			status, read_stat, edit_stat, add_stat, del_stat, rec_date,
			rec_ful_nam, rec_status, DISP_STAT)
		SELECT '#Ucase(attributes.txtSERV_PROV_CODE)#','#TT_MODULE_NAME#', AM.menuitem_code, 
			'ENABLE','N', 'N', 'N', 'N', sysdate,
			'#session.uname#', 'A', 'N'
		FROM   RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
		WHERE  V.AA_VERSION_NBR = A.AA_VERSION_NBR
		AND    V.AA_VERSION_NBR = AM.AA_VERSION_NBR
		AND    AM.MENUITEM_CODE = R.MENUITEM_CODE
		AND    A.MODULE_ALIAS = AM.MODULE_NAME
		AND    V.REC_STATUS = 'A'
		AND    A.REC_STATUS = 'A'
		AND    AM.REC_STATUS = 'A'
		AND    R.REC_STATUS = 'A'
		AND    R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND    V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND    A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND    AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND    UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND    (UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="OPTIONAL" CFSQLTYPE="CF_SQL_VARCHAR"> 
		        OR UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="N" CFSQLTYPE="CF_SQL_VARCHAR">)



--Add REPORT FIDS 
-- name = qry_AgencyMenuItemInsert
INSERT INTO PPROV_MENUITEM_MODULE( serv_prov_code,module_name, menuitem_code, 
			status, read_stat, edit_stat, add_stat, del_stat, rec_date,
			rec_ful_nam, rec_status, DISP_STAT)
		SELECT '#Ucase(attributes.txtSERV_PROV_CODE)#','#TT_MODULE_NAME#', R.menuitem_code, 
			'ENABLE','N', 'N', 'N', 'N', sysdate,
			'#session.uname#', 'A', 'N'
		FROM   RMENUITEM R
		WHERE  R.MENUITEM_CODE LIKE '6%'
		AND    R.REC_STATUS = 'A'
		AND    R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND    UPPER(TRIM(R.FUNCTION_CATEGORY)) in ('TESTING','STANDARD',<CFQUERYPARAM VALUE="#ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">)
		AND    R.MENUITEM_CODE NOT IN 
		       (SELECT  MENUITEM_CODE
		        FROM   PPROV_MENUITEM_MODULE p
					WHERE  p.serv_prov_code=<CFQUERYPARAM VALUE="#UCASE(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
				AND    upper(p.module_name)=<CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
				AND    p.menuitem_code like '6%'
				)

-- Create usergroup for agency
-- name = qry_GrpIDInsert
INSERT INTO pprov_group	(
			group_seq_nbr,serv_prov_code,module_name,disp_text,
			status,rec_date,rec_ful_nam, rec_status)
		VALUES	(
			<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">,
			<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#TT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#TT_MODULE_NAME#Admin" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#isEnable#" CFSQLTYPE="CF_SQL_VARCHAR">,
			SYSDATE,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">, 'A')



--Add Full access FIDS - Formaly Basic
--name = qry_AgencyMenuItemInsert
INSERT INTO XGROUP_MENUITEM_MODULE( serv_prov_code, group_seq_nbr, menuitem_code, 
				status, read_stat, edit_stat, add_stat, del_stat, rec_date,
				rec_ful_nam, rec_status)
			SELECT <CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
				<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">, AM.menuitem_code,
				'ENABLE','Y', 'Y', 'Y', 'Y', sysdate,
				'#session.uname#', 'A'
			FROM   RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
			WHERE  V.AA_VERSION_NBR = A.AA_VERSION_NBR
			AND    V.AA_VERSION_NBR = AM.AA_VERSION_NBR
			AND    AM.MENUITEM_CODE = R.MENUITEM_CODE
			AND    A.MODULE_ALIAS = AM.MODULE_NAME
			AND    V.REC_STATUS = 'A'
			AND    A.REC_STATUS = 'A'
			AND    AM.REC_STATUS = 'A'
			AND    R.REC_STATUS = 'A'
			AND    R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
			AND    V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
			AND    A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
			AND    AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
			AND    UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
			AND    (UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="BASIC" CFSQLTYPE="CF_SQL_VARCHAR">
			        OR UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="F" CFSQLTYPE="CF_SQL_VARCHAR">)
			AND    R.MENUITEM_CODE not in ('0001','0002','0037','0092','0093','0094','0095')


--Add Read Only access FIDS
INSERT INTO XGROUP_MENUITEM_MODULE( serv_prov_code, group_seq_nbr, menuitem_code, 
				status, read_stat, edit_stat, add_stat, del_stat, rec_date,
				rec_ful_nam, rec_status)
			SELECT <CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
				<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">, AM.menuitem_code, 
				'ENABLE', 'Y', 'N', 'N', 'N', sysdate,
				'#session.uname#', 'A'
			FROM 	RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
			WHERE 	V.AA_VERSION_NBR = A.AA_VERSION_NBR
			AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR
			AND	AM.MENUITEM_CODE = R.MENUITEM_CODE
			AND 	A.MODULE_ALIAS = AM.MODULE_NAME
			AND	V.REC_STATUS = 'A'
			AND	A.REC_STATUS = 'A'
			AND	AM.REC_STATUS = 'A'
			AND	R.REC_STATUS = 'A'
			AND	R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
			AND V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
			AND 	A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
			AND 	AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
			AND	UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
			AND	UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="R" CFSQLTYPE="CF_SQL_VARCHAR">
			AND R.MENUITEM_CODE not in ('0001','0002','0037','0092','0093','0094','0095')


--Add REPORT FIDS 
INSERT INTO XGROUP_MENUITEM_MODULE( serv_prov_code, group_seq_nbr, menuitem_code, 
				status, read_stat, edit_stat, add_stat, del_stat, rec_date,
				rec_ful_nam, rec_status)
			SELECT <CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
				<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">, 
				R.menuitem_code, 
				'ENABLE', 'N', 'N', 'N', 'N', sysdate,
				'#session.uname#', 'A'
			FROM   RMENUITEM R
			WHERE  R.MENUITEM_CODE LIKE '6%'
			AND    R.REC_STATUS = 'A'
			AND    R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
			AND    UPPER(TRIM(R.FUNCTION_CATEGORY)) in ('TESTING','STANDARD',<CFQUERYPARAM VALUE="#ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">)
			AND    R.MENUITEM_CODE NOT IN 
			       (SELECT  MENUITEM_CODE
			        FROM   XGROUP_MENUITEM_MODULE x
						WHERE  x.serv_prov_code=<CFQUERYPARAM VALUE="#UCASE(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
					AND    x.group_seq_nbr=<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">
					AND    x.menuitem_code like '6%'
					)


-- Grant the user ADMIN right of group for agency
INSERT INTO PUSER_GROUP(serv_prov_code,user_name,group_seq_nbr,
			module_name,rec_date,rec_ful_nam,rec_status)
			VALUES(<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,'ADMIN',
			<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">,
			<CFQUERYPARAM VALUE="#TT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">,
			sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#isActive#" CFSQLTYPE="CF_SQL_VARCHAR">)


--Update_Puser_Profile
UPDATE 	PUSER_PROFILE
			SET		PUSER_PROFILE.PROFILE_VALUE = <CFQUERYPARAM VALUE="#DEFAULT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">,
			PUSER_PROFILE.REC_DATE = sysdate,
			PUSER_PROFILE.REC_FUL_NAM = <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">
			WHERE 	PUSER_PROFILE.PROFILE_SEQ_NBR = <CFQUERYPARAM VALUE="#PROFILE_SEQ_NBR#" CFSQLTYPE="CF_SQL_VARCHAR">
			AND		PUSER_PROFILE.USER_NAME = 'ADMIN'
			AND		PUSER_PROFILE.SERV_PROV_CODE = <CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">	


--Add_RBIZDOMAIN

INSERT INTO	RBIZDOMAIN(
	SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,DEFAULT_VALUE,
	REC_DATE,REC_FUL_NAM,REC_STATUS)
VALUES(
	<CFQUERYPARAM VALUE="#Ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'CENSUS_BUREAU_CONSTRUCTION_TYPE_CODE','Construction Code for Census Bureau','250','649',
	sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')


INSERT INTO	RBIZDOMAIN(
	SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,
	REC_DATE,REC_FUL_NAM,REC_STATUS)
VALUES(
	<CFQUERYPARAM VALUE="#Ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'CONDITION STATUS','Condition Status','30',
	sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')



INSERT INTO	RBIZDOMAIN(
	SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,
	REC_DATE,REC_FUL_NAM,REC_STATUS)
VALUES(
	<CFQUERYPARAM VALUE="#Ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'CONDITION TYPE','Condition Type','10',
	sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')



--partialCAPDefaultSequenceDef
INSERT INTO AA_SEQ_DEF (
	SERV_PROV_CODE,
	SEQ_TYPE,
	SEQ_NAME,
	SEQ_DESCRIPTION,
	SEQ_CACHE_SIZE,
	SEQ_INCR_BY,
	SEQ_MIN,
	SEQ_RESET,
	SEQ_RESET_ACTION,
	SEQ_INTERVAL_TYPE,
	REC_DATE,
	REC_FUL_NAM,
	REC_STATUS )
	VALUES(
	<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'Partial CAP ID',
	'Default',
	'Default sequence Definition for Partial CAP ID',
	1,
	1,
	1,
	999999,
	'E',
	'CY',
	sysdate,
	<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'A')


--partialCAPDefaultMaskDef
INSERT INTO AA_MASK_DEF (
	SERV_PROV_CODE,
	SEQ_TYPE,
	MASK_NAME,
	MASK_DESCRIPTION,
	MASK_PATTERN,
	MASK_MAX_LENGTH,
	MASK_MIN_LENGTH,
	SEQ_NAME,
	SEQ_RADIX,
	REC_DATE,
	REC_FUL_NAM,
	REC_STATUS)
	VALUES(
	<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'Partial CAP ID',
	'Default',
	'Mask Definition for Partial CAP ID',
	'$$yy$$EST-$$SEQ06$$',
	30,
	1,
	'Default',
	10,
	sysdate,
	<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'A')


--temporaryCAPDefaultSequenceDef
INSERT INTO AA_SEQ_DEF (
	SERV_PROV_CODE,
	SEQ_TYPE,
	SEQ_NAME,
	SEQ_DESCRIPTION,
	SEQ_CACHE_SIZE,
	SEQ_INCR_BY,
	SEQ_MIN,
	SEQ_RESET,
	SEQ_RESET_ACTION,
	SEQ_INTERVAL_TYPE,
	REC_DATE,
	REC_FUL_NAM,
	REC_STATUS )
	VALUES(
	<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'Temporary CAP ID',
	'Default',
	'Default sequence Definition for Temporary CAP ID',
	1,
	1,
	1,
	999999,
	'E',
	'CY',
	sysdate,
	<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,
	'A')


--qry_ReceiptNoInsert
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
	rec_date,rec_ful_nam,rec_status)
	VALUES('#Ucase(attributes.txtSERV_PROV_CODE)#','CUSTOMIZED_RECEIPT_NUMBER','#attributes.DEF_NBR_RECEIPT_FLG#','Customized Receipt Number ',
	sysdate,'#session.uname#','A')

--UpdateRSERV_PROV
UPDATE RSERV_PROV set 		

	ADDRESS1=<CFQUERYPARAM VALUE="#UCase(attributes.txtADDRESS1)#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	ADDRESS2=<CFQUERYPARAM VALUE="#UCase(attributes.txtADDRESS2)#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	APO_SRC_SEQ_NBR=<CFQUERYPARAM VALUE="#attributes.txtAPO_SRC_SEQ_NBR#" CFSQLTYPE="CF_SQL_VARCHAR">,
	CITY=<CFQUERYPARAM VALUE="#UCase(attributes.txtCITY)#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	CONTACT_LINE1=<CFQUERYPARAM VALUE="#attributes.txtCONTACT_LINE1#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	CONTACT_LINE2=<CFQUERYPARAM VALUE="#attributes.txtCONTACT_LINE2#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	NAME=<CFQUERYPARAM VALUE="#attributes.txtNAME#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	NAME2=<CFQUERYPARAM VALUE="#UCase(attributes.txtNAME2)#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	STATE=<CFQUERYPARAM VALUE="#UCase(attributes.txtSTATE)#" CFSQLTYPE="CF_SQL_VARCHAR">, 
	ZIP=<CFQUERYPARAM VALUE="#attributes.txtZIP#" CFSQLTYPE="CF_SQL_VARCHAR">,
	SET_ID_PREFIX=<CFQUERYPARAM VALUE="#attributes.txtSetId_Prefix#" CFSQLTYPE="CF_SQL_VARCHAR">,
	DEF_NBR_SCHEME_FLG = <CFQUERYPARAM VALUE="#attributes.DEF_NBR_SCHEME_FLG#" CFSQLTYPE="CF_SQL_VARCHAR">,
	TIME_ZONE=<CFQUERYPARAM VALUE="#attributes.txtTimeZone#" CFSQLTYPE="CF_SQL_VARCHAR">,
	DAYLIGHT_SAVING=<CFQUERYPARAM VALUE="#attributes.cbTimeZoneDLSAdjust#" CFSQLTYPE="CF_SQL_VARCHAR">,
	SPECIAL_HANDLE=<CFQUERYPARAM VALUE="#attributes.txtSpecialHandle#" CFSQLTYPE="CF_SQL_VARCHAR">,
	REC_DATE = SYSDATE,
	<!--- To Disable User Account & Force User to Change Password, Added by Leon Luo --->
	ACCOUNT_DISABLE_PERIOD=<CFQUERYPARAM VALUE="#attributes.AccountDisableTimeframe#" CFSQLTYPE="CF_SQL_VARCHAR">,
	PASSWORD_EXPIRE_TIMEFRAME=<CFQUERYPARAM VALUE="#attributes.PasswordTimeoutTimeframe#" CFSQLTYPE="CF_SQL_VARCHAR">,
	ALLOW_USER_CHANGE_PASSWORD=<CFQUERYPARAM VALUE="#attributes.rbPasswordChange#" CFSQLTYPE="CF_SQL_VARCHAR">,
	<!--- Leon Luo added end --->
	REC_FUL_NAM = <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR"> 
	WHERE SERV_PROV_CODE=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">


--Insert_Ad_Hoc_Multi_Agencies_seq
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
	rec_date,rec_ful_nam,rec_status)
	VALUES('#Ucase(attributes.txtSERV_PROV_CODE)#','#vAd_Hoc_Multi_Agencies_seq_constant_name#', '#vAd_Hoc_Multi_Agencies_seq#','#vAgenciesSeqList#',
	sysdate,'#session.uname#','A')


--Update_Ad_Hoc_Multi_Agencies_seq
UPDATE 	r1server_constant
	SET		
	constant_value='#vAd_Hoc_Multi_Agencies_seq#',
	description = '#vAgenciesSeqList#',
	REC_DATE = SYSDATE,
	REC_FUL_NAM = '#session.uname#' 
	WHERE  	serv_prov_code='#UCase(attributes.txtSERV_PROV_CODE)#'
	AND		UPPER(constant_name) ='AD_HOC_SOURCE_SEQ'


--Add_BIZDOMAINFindAppDateRange
INSERT INTO	RBIZDOMAIN(
		SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,
		REC_DATE,REC_FUL_NAM,REC_STATUS)
	VALUES(
		<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
		'Find App Date Range','Find App Date Range',30,sysdate,
		<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')


--Add_BIZDOMAIN_VALUEFindAppDateRange
INSERT INTO	RBIZDOMAIN_VALUE(
		SERV_PROV_CODE,BIZDOMAIN,BIZDOMAIN_VALUE,BDV_SEQ_NBR,
		REC_DATE,REC_FUL_NAM,REC_STATUS)
	VALUES(
		<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
		'Find App Date Range',<CFQUERYPARAM VALUE="#attributes.FindAppDateRange#" CFSQLTYPE="CF_SQL_VARCHAR">,#RBIZDOMAIN_VALUE_SEQ.nextval#,
		sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')

--Update_BIZDOMAIN_VALUEFindAppDateRange

UPDATE 	RBIZDOMAIN_VALUE
		SET		
		BIZDOMAIN_VALUE='#attributes.FindAppDateRange#',
		REC_DATE = SYSDATE,
		REC_FUL_NAM = '#session.uname#' 
		WHERE  	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		UPPER(BIZDOMAIN) ='FIND APP DATE RANGE'
		AND 	REC_STATUS = 'A')


--qry_AgencyMenuItemInsert
--dd Full access FIDs - formally BASIC // Add Read Only access FIDs  //Add None access FIDS formally Optional  //Add REPORT FIDS
INSERT INTO PPROV_MENUITEM_MODULE(
		serv_prov_code,module_name, menuitem_code, 
		status, read_stat, edit_stat, add_stat, del_stat, rec_date,
		rec_ful_nam, rec_status, DISP_STAT)
	SELECT 
		'#Ucase(attributes.txtSERV_PROV_CODE)#',
		'#TT_MODULE_NAME#', 
		AM.menuitem_code, 
		'ENABLE', 'Y', 'Y', 'Y', 'Y', 
		sysdate, '#session.uname#', 'A', 'N'
		FROM 	RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
		WHERE 	V.AA_VERSION_NBR = A.AA_VERSION_NBR
		AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR
		AND	AM.MENUITEM_CODE = R.MENUITEM_CODE
		AND 	A.MODULE_ALIAS = AM.MODULE_NAME
		AND	V.REC_STATUS = 'A'
		AND	A.REC_STATUS = 'A'
		AND	AM.REC_STATUS = 'A'
		AND	R.REC_STATUS = 'A'
		AND	R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND 	V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND 	A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND 	AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND	UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND	(UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="BASIC" CFSQLTYPE="CF_SQL_VARCHAR"> 
			OR UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="F" CFSQLTYPE="CF_SQL_VARCHAR">)
		<!--- Fixed bug#2048 by Chandler. Don't insert the data that exists in  PPROV_MENUITEM_MODULE--->
		AND AM.menuitem_code not in (SELECT 
		AM.menuitem_code
		FROM 	RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM, PPROV_MENUITEM_MODULE P
		WHERE 	V.AA_VERSION_NBR = A.AA_VERSION_NBR
		AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR
		AND	AM.MENUITEM_CODE = R.MENUITEM_CODE
		AND 	A.MODULE_ALIAS = AM.MODULE_NAME
		AND	V.REC_STATUS = 'A'
		AND	A.REC_STATUS = 'A'
		AND	AM.REC_STATUS = 'A'
		AND	R.REC_STATUS = 'A'
		AND	R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND 	V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND 	A.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND 	AM.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND	UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND	(UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="BASIC" CFSQLTYPE="CF_SQL_VARCHAR"> 
			OR UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="F" CFSQLTYPE="CF_SQL_VARCHAR">)
		AND AM.menuitem_code = P.menuitem_code
		AND P.serv_prov_code = <CFQUERYPARAM VALUE="#Ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND P.module_name = <CFQUERYPARAM VALUE="#TT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">
		)

--qry_GrpIDInsert
INSERT INTO pprov_group	(
			group_seq_nbr,serv_prov_code,module_name,disp_text,
			status,rec_date,rec_ful_nam,rec_status)
		VALUES (
			<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">,
			<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#TT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#TT_MODULE_NAME#Admin" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#isEnable#" CFSQLTYPE="CF_SQL_VARCHAR">,
			SYSDATE,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">, 'A')


--qry_PUserGroupInsert
INSERT INTO PUSER_GROUP(
			serv_prov_code,user_name,group_seq_nbr,
			module_name,rec_date,rec_ful_nam,rec_status)
		VALUES (
			<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,'ADMIN',
			<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">,
			<CFQUERYPARAM VALUE="#TT_MODULE_NAME#" CFSQLTYPE="CF_SQL_VARCHAR">,
			sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#isActive#" CFSQLTYPE="CF_SQL_VARCHAR">)

--qry_AgencyMenuItemInsert
INSERT INTO XGROUP_MENUITEM_MODULE(
			serv_prov_code, group_seq_nbr, menuitem_code, 
			status, read_stat, edit_stat, add_stat, del_stat, rec_date,
			rec_ful_nam, rec_status)
		SELECT 
			<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
			<CFQUERYPARAM VALUE="#pprov_group_seq.nex_val#" CFSQLTYPE="CF_SQL_DECIMAL">, 
			AM.menuitem_code, 
			'ENABLE', 'Y', 'Y', 'Y', 'Y', 
			sysdate, '#session.uname#', 'A'
		FROM 	RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM
		WHERE V.AA_VERSION_NBR = <CFQUERYPARAM VALUE="#GetAgencyAAversion.AA_VERSION_NBR#" CFSQLTYPE="CF_SQL_DECIMAL">
		AND 	A.AA_VERSION_NBR = V.AA_VERSION_NBR
		AND	AM.AA_VERSION_NBR = A.AA_VERSION_NBR
		AND	UPPER(A.MODULE_NAME) = <CFQUERYPARAM VALUE="#Ucase(TT_MODULE_NAME)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND 	AM.MODULE_NAME = A.MODULE_ALIAS
		AND	AM.MENUITEM_CODE = R.MENUITEM_CODE
		AND	V.REC_STATUS = 'A'
		AND	A.REC_STATUS = 'A'
		AND	AM.REC_STATUS = 'A'
		AND	R.REC_STATUS = 'A'
		AND	R.STATUS = <CFQUERYPARAM VALUE="ENABLE" CFSQLTYPE="CF_SQL_VARCHAR">
		AND	(UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="BASIC" CFSQLTYPE="CF_SQL_VARCHAR">
			 OR UPPER(AM.FUNCTION_OPTION)=<CFQUERYPARAM VALUE="F" CFSQLTYPE="CF_SQL_VARCHAR">)




-- module already exists; update it
--UpdateModule
UPDATE 	r1server_constant
		SET		
			constant_value=<CFQUERYPARAM VALUE="#evaluate('attributes.rbModule#i#')#" CFSQLTYPE="CF_SQL_VARCHAR">,
			rec_date=sysdate,
			rec_ful_nam=<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">
		WHERE  	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		upper(constant_name)=<CFQUERYPARAM VALUE="#UCase(tt_module_name)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND     description='Module')

--Update_pprov_group
UPDATE	pprov_group
		SET		
			status=<CFQUERYPARAM VALUE="#isEnable#" CFSQLTYPE="CF_SQL_VARCHAR">,
			rec_date=sysdate,
			rec_ful_nam=<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">
		WHERE	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		upper(module_name)=<CFQUERYPARAM VALUE="#UCase(tt_module_name)#" CFSQLTYPE="CF_SQL_VARCHAR">


--Update_puser_group
UPDATE	puser_group
		SET		
			rec_status=<CFQUERYPARAM VALUE="#isActive#" CFSQLTYPE="CF_SQL_VARCHAR">,
			rec_date=sysdate,
			rec_ful_nam=<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">
		WHERE	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		upper(module_name)=<CFQUERYPARAM VALUE="#UCase(tt_module_name)#" CFSQLTYPE="CF_SQL_VARCHAR">


--Add_EMailHyperlink
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
		rec_date,rec_ful_nam,rec_status)
		VALUES(<CFQUERYPARAM VALUE="#Ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
			   'EMAIL_HYPERLINK',
			   <CFQUERYPARAM VALUE="#attributes.EMailHyperlinkFlag#" CFSQLTYPE="CF_SQL_VARCHAR">,
			   'The controller of Email hyperlink',
			   sysdate,'#session.uname#','A')

--UpdateEnforcementModule
UPDATE 	r1server_constant
		SET		
		constant_value=<CFQUERYPARAM VALUE="#attributes.EMailHyperlinkFlag#" CFSQLTYPE="CF_SQL_VARCHAR">,
		rec_date=sysdate,
		rec_ful_nam=<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">
		WHERE  	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		constant_name ='EMAIL_HYPERLINK'	



--Add_CommasNumericFormat
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
		rec_date,rec_ful_nam,rec_status)
		VALUES(<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">,
		'COMMAS_NUMERIC_APP_TASK_FORMAT',<CFQUERYPARAM VALUE="#attributes.CommasNumericFlag#" CFSQLTYPE="CF_SQL_VARCHAR">,'Commas in Numeric App and Task Specific Info Fields',
		sysdate,<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,'A')

--UpdateEnforcementModule
UPDATE 	r1server_constant
		SET		
		constant_value=<CFQUERYPARAM VALUE="#attributes.CommasNumericFlag#" CFSQLTYPE="CF_SQL_VARCHAR">,
		rec_date=sysdate,
		rec_ful_nam=<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">
		WHERE  	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		constant_name ='COMMAS_NUMERIC_APP_TASK_FORMAT'	


--Add_BIZDOMAINOrgNameValue, Update_BIZDOMAIN_VALUEOrgNameValue



---CheckReceiptNoResultInsert
INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,
rec_date,rec_ful_nam,rec_status)
VALUES(<CFQUERYPARAM VALUE="#Ucase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">, 
		'CUSTOMIZED_RECEIPT_NUMBER', 
		<CFQUERYPARAM VALUE="#attributes.DEF_NBR_RECEIPT_FLG#" CFSQLTYPE="CF_SQL_VARCHAR">, 
		'denote whether the agency need active the receipt mask number ',
		sysdate,
		<CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR">,
		'A')


--CheckReceiptNoResultUpdate
UPDATE 	r1server_constant
		SET		
		constant_value=<CFQUERYPARAM VALUE="#attributes.DEF_NBR_RECEIPT_FLG#" CFSQLTYPE="CF_SQL_VARCHAR">,
		REC_DATE = SYSDATE,
		REC_FUL_NAM = <CFQUERYPARAM VALUE="#session.uname#" CFSQLTYPE="CF_SQL_VARCHAR"> 
		WHERE  	serv_prov_code=<CFQUERYPARAM VALUE="#UCase(attributes.txtSERV_PROV_CODE)#" CFSQLTYPE="CF_SQL_VARCHAR">
		AND		Upper(constant_name)='CUSTOMIZED_RECEIPT_NUMBER'