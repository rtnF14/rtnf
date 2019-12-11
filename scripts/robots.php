<?php if (!defined('PmWiki')) exit();
/*  Copyright 2005-2017 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This file provides various features to allow PmWiki to control
    what web crawlers (robots) see when they visit the site.  Of course
    it's still possible to control robots at the webserver level 
    and via robots.txt, but this page provides some finer level
    of control.

    The $MetaRobots variable controls generation of the 
    <meta name='robots' ... /> tag in the head of the HTML document.
    By default $MetaRobots is set so that robots do not index pages in
    the Site, SiteAdmin, and PmWiki groups.

    The $RobotPattern variable is used to determine if the user agent
    accessing the site is a robot, and $IsRobotAgent is set accordingly.  
    By default this pattern identifies Googlebot, Yahoo! Slurp, msnbot, 
    BecomeBot, and HTTrack as robots.

    If the agent is deemed a robot, then the $RobotActions array is
    checked to see if robots are allowed to perform the given action,
    and if not the robot is immediately sent an HTTP 403 Forbidden
    response.

    If $EnableRobotCloakActions is set, then a pattern is added to
    $FmtP to hide any "?action=" url parameters in page urls
    generated by PmWiki for actions that robots aren't allowed to
    access.  This can greatly reduce the load on the server by 
    not providing the robot with links to pages that it will be 
    forbidden to index anyway.
    
    Script maintained by Petko YOTOV www.pmwiki.org/petko
*/

## $MetaRobots provides the value for the <meta name='robots' ...> tag.
SDV($MetaRobots,
      ($action!='browse' || !PageExists($pagename)
        || preg_match('#^PmWiki[./](?!PmWiki$)|^Site(Admin)?[./]#', $pagename))
      ? 'noindex,nofollow' : 'index,follow');
if ($MetaRobots)
  $HTMLHeaderFmt['robots'] =
    "  <meta name='robots' content='\$MetaRobots' />\n";

## $RobotPattern is used to identify robots.
SDV($RobotPattern,'\\w+[-_ ]?(bot|spider|crawler)'
  .'|Slurp|Teoma|ia_archiver|HTTrack|XML Sitemaps|Jabse|Yandex|PageAnalyzer|Yeti|Riddler|Aboundex|ADmantX|WikiDo'
  .'|Pinterest|Qwantify|worldwebheritage|coccoc|HostWallker|Add Catalog|idmarch|MegaIndex|heritrix|SEOdiver');
SDV($IsRobotAgent, 
  $RobotPattern && preg_match("!$RobotPattern!i", @$_SERVER['HTTP_USER_AGENT']));
if (!$IsRobotAgent) return;

## $RobotActions indicates which actions a robot is allowed to perform.
SDVA($RobotActions, array('browse' => 1, 'rss' => 1, 'dc' => 1));
if (!@$RobotActions[$action]) {
  $pagename = ResolvePageName($pagename);
  if (!PageExists($pagename)) {
    header("HTTP/1.1 404 Not Found");
    print("<h1>Not Found</h1>");
    exit();
  }
  header("HTTP/1.1 403 Forbidden");
  print("<h1>Forbidden</h1>");
  exit();
}

## The following removes any ?action= parameters that robots aren't
## allowed to access.
function cb_bool($a) { return (boolean)$a; }
if (IsEnabled($EnableRobotCloakActions, 0)) {
  $p = join('|', array_keys(array_filter($RobotActions, 'cb_bool')));
  $FmtPV['$PageUrl'] = 
    'PUE(($EnablePathInfo)
         ? "\\$ScriptUrl/$group/$name"
         : "\\$ScriptUrl?n=$group.$name")';
  $FmtP["/(\\\$ScriptUrl[^#\"'\\s<>]+)\\?action=(?!$p)\\w+/"] = '$1';
}

