[#ftl/]
[#setting url_escaping_charset="UTF-8"]
[#-- @ftlvariable name="application" type="io.fusionauth.domain.Application" --]
[#-- @ftlvariable name="bootstrapWebauthnEnabled" type="boolean" --]
[#-- @ftlvariable name="client_id" type="java.lang.String" --]
[#-- @ftlvariable name="code_challenge" type="java.lang.String" --]
[#-- @ftlvariable name="code_challenge_method" type="java.lang.String" --]
[#-- @ftlvariable name="devicePendingIdPLink" type="io.fusionauth.domain.provider.PendingIdPLink" --]
[#-- @ftlvariable name="hasDomainBasedIdentityProviders" type="boolean" --]
[#-- @ftlvariable name="identityProviders" type="java.util.Map<java.lang.String, java.util.List<io.fusionauth.domain.provider.BaseIdentityProvider<?>>>" --]
[#-- @ftlvariable name="idpRedirectState" type="java.lang.String" --]
[#-- @ftlvariable name="loginId" type="java.lang.String" --]
[#-- @ftlvariable name="metaData" type="io.fusionauth.domain.jwt.RefreshToken.MetaData" --]
[#-- @ftlvariable name="nonce" type="java.lang.String" --]
[#-- @ftlvariable name="passwordlessEnabled" type="boolean" --]
[#-- @ftlvariable name="pendingIdPLink" type="io.fusionauth.domain.provider.PendingIdPLink" --]
[#-- @ftlvariable name="redirect_uri" type="java.lang.String" --]
[#-- @ftlvariable name="rememberDevice" type="boolean" --]
[#-- @ftlvariable name="response_type" type="java.lang.String" --]
[#-- @ftlvariable name="scope" type="java.lang.String" --]
[#-- @ftlvariable name="showCaptcha" type="boolean" --]
[#-- @ftlvariable name="showPasswordField" type="boolean" --]
[#-- @ftlvariable name="showWebAuthnReauthLink" type="boolean" --]
[#-- @ftlvariable name="state" type="java.lang.String" --]
[#-- @ftlvariable name="tenant" type="io.fusionauth.domain.Tenant" --]
[#-- @ftlvariable name="tenantId" type="java.util.UUID" --]
[#-- @ftlvariable name="timezone" type="java.lang.String" --]
[#-- @ftlvariable name="user_code" type="java.lang.String" --]
[#-- @ftlvariable name="version" type="java.lang.String" --]
[#import "../_helpers.ftl" as helpers/]

[@helpers.html]
  [@helpers.head]
    <script src="${request.contextPath}/js/jstz-min-1.0.6.js"></script>
    [@helpers.captchaScripts showCaptcha=showCaptcha captchaMethod=tenant.captchaConfiguration.captchaMethod siteKey=tenant.captchaConfiguration.siteKey/]
    <script src="${request.contextPath}/js/oauth2/Authorize.js?version=${version}"></script>
    <script src="${request.contextPath}/js/identityProvider/InProgress.js?version=${version}"></script>
    [@helpers.alternativeLoginsScript clientId=client_id identityProviders=identityProviders/]
    <script>
      Prime.Document.onReady(function() {
        [#-- This object handles guessing the timezone, filling in the device id of the user, and check for WebAuthn re-authentication support --]
        new FusionAuth.OAuth2.Authorize();
      });
    </script>
  [/@helpers.head]
  [@helpers.body]
    [#-- TODO find a way to use img tag with src --]
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      xml:space="preserve"
      class="my-logo"
    >
      <path 
        fill="#282D33" 
        d="M80.139 103.801H47.715V55.703H30.227V23.282h67.4v32.421H80.139v48.098zm-28.424-4h24.424V51.703h17.488V27.282h-59.4v24.421h17.488v48.098zM0 23.279h5.362v4H0zM9.901 23.279h5.363v4H9.901zM19.799 23.279h5.364v4h-5.364zM102.838 23.279h5.363v4h-5.363zM112.736 23.279h5.363v4h-5.363zM122.637 23.279H128v4h-5.363zM76.139 3.551h4v5.363h-4zM76.139 13.452h4v5.364h-4z"
      />
        <g><path fill="#282D33" d="M47.715 3.551h4v5.363h-4zM47.715 13.452h4v5.364h-4z"/></g>
        <g><path fill="#282D33" d="M76.139 109.186h4v5.365h-4zM76.139 119.086h4v5.363h-4z"/></g>
        <g><path fill="#282D33" d="M47.715 109.186h4v5.365h-4zM47.715 119.086h4v5.363h-4z"/></g>
        <g><path fill="#282D33" d="M0 51.703h5.362v4H0zM9.901 51.703h5.363v4H9.901zM19.799 51.703h5.364v4h-5.364z"/></g>
        <g><path fill="#282D33" d="M102.838 51.703h5.363v4h-5.363zM112.736 51.703h5.363v4h-5.363zM122.637 51.703H128v4h-5.363z"/></g>
    </svg>
    
    [@helpers.header]
      [#-- Custom header code goes here --]
    [/@helpers.header]

    [@helpers.main title=theme.message('login')]
      [#-- During a linking work flow, optionally indicate to the user which IdP is being linked. --]
      [#if devicePendingIdPLink?? || pendingIdPLink??]
        <p class="mt-0">
        [#if devicePendingIdPLink?? && pendingIdPLink??]
          ${theme.message('pending-links-login-to-complete', devicePendingIdPLink.identityProviderName, pendingIdPLink.identityProviderName)}
        [#elseif devicePendingIdPLink??]
          ${theme.message('pending-link-login-to-complete', devicePendingIdPLink.identityProviderName)}
        [#else]
          ${theme.message('pending-link-login-to-complete', pendingIdPLink.identityProviderName)}
        [/#if]
        [#-- A pending link can be cancled. If we also have a device link in progress, this cannot be canceled. --]
        [#if pendingIdPLink??]
          [@helpers.link url="" extraParameters="&cancelPendingIdpLink=true"]${theme.message('login-cancel-link')}[/@helpers.link]
        [/#if]
        </p>
      [/#if]
      <form action="${request.contextPath}/oauth2/authorize" method="POST" class="full">
        [@helpers.oauthHiddenFields/]
        [@helpers.hidden name="showPasswordField"/]
        [@helpers.hidden name="userVerifyingPlatformAuthenticatorAvailable"/]
        [#if showPasswordField && hasDomainBasedIdentityProviders]
          [@helpers.hidden name="loginId"/]
        [/#if]

        <fieldset>
          [@helpers.input type="text" name="loginId" id="loginId" autocomplete="username" autocapitalize="none" autocomplete="on" autocorrect="off" spellcheck="false" autofocus=(!loginId?has_content) placeholder=theme.message('loginId') leftAddon="user" disabled=(showPasswordField && hasDomainBasedIdentityProviders)/]
          [#if showPasswordField]
            [@helpers.input type="password" name="password" id="password" autocomplete="current-password" autofocus=loginId?has_content placeholder=theme.message('password') leftAddon="lock"/]
            [@helpers.captchaBadge showCaptcha=showCaptcha captchaMethod=tenant.captchaConfiguration.captchaMethod siteKey=tenant.captchaConfiguration.siteKey/]
          [/#if]
        </fieldset>

          [@helpers.input id="rememberDevice" type="checkbox" name="rememberDevice" label=theme.message('remember-device') value="true" uncheckedValue="false"]
            <i class="fa fa-info-circle" data-tooltip="${theme.message('{tooltip}remember-device')}"></i>[#t/]
          [/@helpers.input]

          <div class="form-row">
            [#if showPasswordField]
              [@helpers.button icon="key" text=theme.message('submit')/]
              [@helpers.link url="${request.contextPath}/password/forgot"]${theme.message('forgot-your-password')}[/@helpers.link]
            [#else]
              [@helpers.button icon="arrow-right" text=theme.message('next')/]
            [/#if]
          </div>
      </form>
      <div>
        [#if showPasswordField && hasDomainBasedIdentityProviders]
          [@helpers.link url="" extraParameters="&showPasswordField=false"]${theme.message('sign-in-as-different-user')}[/@helpers.link]
        [/#if]
      </div>
      [#if application.registrationConfiguration.enabled]
        <div class="form-row push-top">
          ${theme.message('dont-have-an-account')}
          [@helpers.link url="${request.contextPath}/oauth2/register"]${theme.message('create-an-account')}[/@helpers.link]
        </div>
      [/#if]

     [#if showWebAuthnReauthLink]
       [@helpers.link url="${request.contextPath}/oauth2/webauthn-reauth"] ${theme.message('return-to-webauthn-reauth')} [/@helpers.link]
     [/#if]
      [@helpers.alternativeLogins clientId=client_id identityProviders=identityProviders passwordlessEnabled=passwordlessEnabled bootstrapWebauthnEnabled=bootstrapWebauthnEnabled idpRedirectState=idpRedirectState/]
    [/@helpers.main]

    [@helpers.footer]
      [#-- Custom footer code goes here --]
    [/@helpers.footer]

  [/@helpers.body]
[/@helpers.html]