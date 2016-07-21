var uiOCC = {
	uiWindow: [],
	uiWindowDraggable: false,
	uiWindowLayer: [],
	uiWindowCurrentFocus: null
};
$(document).ready(function() {
	uiOCC.uiWindow = document.getElementsByClassName('ui-window');
	uiOCCSetWindowId("init");
	setWindowDraggable();
	updateClock();
	setInterval(updateClock, 1000);
	if ($(window).width() < 1000) { initMobile(); }
	if (location.hash != '') {
		preLaunchApp = location.hash;
		preLaunchApp = preLaunchApp.slice(1, preLaunchApp.length);
		launchApp(this.getElementById(preLaunchApp));
	}
});
$(window).resize(function() {
	setWindowDraggable();
	setDesktopIconHideOrNot();
	switchBetweenMobileState();
});
$('.ui-window').mousedown(function(e) {
	uiOCC.uiWindowCurrentFocus = parseInt(e.currentTarget.getAttribute('data-window-id'));
	uiOCCReArrangeWindowLayer();
});
$('.ui-window-close').click(function(e) {
	$(e.target).parent().parent().addClass("ui-window-closed");
});
function initMobile() {
	$('.ui-window').addClass("ui-window-closed");
	$('#hitcon_registration').removeClass("ui-window-closed");
}
function launchApp(target) {
	if (target != undefined) {
		if (target == document.getElementById('hitcon_location')) {
			setTimeout(function(){ initialize(); }, 1000);
		}
		if ($(window).width() >= 1000) {
			if ($(target).hasClass("ui-window-closed")) {
				$(target).removeClass("ui-window-closed");
				if (target.id.indexOf('hitcon_events_') != -1) {
					$(target).css({"top": "88px", "left": "150px"});
				} else {
					$(target).css({"top": "58px", "left": "120px"});
				}
			}
		} else {
			$('.desktop-icons').removeClass('desktop-icons-opened');
			$('.ui-window').addClass("ui-window-closed");
			$(target).removeClass("ui-window-closed");
		}
		history.pushState({state: target.id}, document.title, "#" + target.id);
		uiOCC.uiWindowCurrentFocus = $(target).attr('data-window-id');
		uiOCCReArrangeWindowLayer();
	}
}
function updateClock() {
	var date = new Date();
	var displayTime = date.getHours() + ":" + date.getMinutes();
	if ($('#status-bar-clock').text() != displayTime) {
		$('#status-bar-clock').text(displayTime);
	}
}
function openAppMenu(e) {
	if ($('.desktop-icons').hasClass('desktop-icons-opened')) {
		$('.desktop-icons').removeClass('desktop-icons-opened');
	} else {
		$('.desktop-icons').addClass('desktop-icons-opened');
	}
}
function switchBetweenMobileState() {
	if ($(window).width() < 1000) {
		$('.ui-window').addClass("ui-window-closed");
		if (uiOCC.uiWindowCurrentFocus == 0 || uiOCC.uiWindowCurrentFocus == null) {
			$('#hitcon_registration').removeClass("ui-window-closed");
		}
		$(uiOCC.uiWindow[uiOCC.uiWindowCurrentFocus]).removeClass("ui-window-closed");
	} else {
		$('#hitcon_registration').removeClass("ui-window-closed");
	}
}
function setDesktopIconHideOrNot() {
	if ($(window).width() >= 1000 && $('.desktop-icons').hasClass('desktop-icons-opened')) {
		$('.desktop-icons').removeClass('desktop-icons-opened');
	}
}
function uiOCCReArrangeWindowLayer() {
	var originalIndex = uiOCC.uiWindowLayer.indexOf(parseInt(uiOCC.uiWindowCurrentFocus));
	var currentFocusWindowId = uiOCC.uiWindow[uiOCC.uiWindowCurrentFocus].id;
	uiOCC.uiWindowLayer[uiOCC.uiWindowLayer.length] = parseInt(uiOCC.uiWindowCurrentFocus);
	uiOCC.uiWindowLayer.splice(originalIndex, 1);
	for (var i = 0, j = uiOCC.uiWindow.length; i < j; i++) {
		uiOCC.uiWindow[i].style.zIndex = uiOCC.uiWindowLayer.indexOf(i) + 1200;
	}
	history.pushState({state: currentFocusWindowId}, document.title, "#" + currentFocusWindowId);
}
function uiOCCSetWindowId(method) {
	for (var i = 0, j = uiOCC.uiWindow.length; i < j; i++) {
		uiOCC.uiWindow[i].setAttribute('data-window-id', i);
		if (method == "init") { uiOCC.uiWindowLayer[i] = i; }
	}
}
function setWindowDraggable() {
	if ($(window).width() >= 1000 && !uiOCC.uiWindowDraggable) {
		$('.ui-window').draggable({
			disabled: false,
			handle: $('.ui-window-header')
		});
		uiOCC.uiWindowDraggable = true;
	}
	if ($(window).width() < 1000 && uiOCC.uiWindowDraggable) {
		$('.ui-window').draggable("destroy");
		$('.ui-window').css({"width": "", "height": ""});
		if ($('.ui-window').hasClass("ui-window-closed")) {
			$('.ui-window').removeClass("ui-window-closed");
		}
		uiOCC.uiWindowDraggable = false;
	}
}