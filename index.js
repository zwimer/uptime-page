// URLs (reversed to stop 'dumb' web-crawlers from being annoying)

const pub_rev = "cilbup/sutats/moc.remiwz.tneculsnart-emitpu//:sptth"
const vpn_rev = "tseug/sutats/moc.remiwz.oyrc.emitpu//:sptth"
const priv_rev = "nom-vres-virp/sutats/moc.remiwz.oyrc.emitpu.virp//:sptth"

function rev(str) { return str.split("").reverse().join(""); }

const pub = rev(pub_rev);
const vpn = rev(vpn_rev);
const priv = rev(priv_rev);

// Handles

const failed_handles = new Set();
const retry = 1000;

function handle_pub(reachable) {
	const elem = document.getElementById("public-frame");
	if (reachable) {
		elem.innerHTML = '<iframe src="' + pub + '"></iframe>';
		return;
	}
	if (! failed_handles.has(pub)) {
		elem.innerHTML = `
			<div class="alert warning">
				<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
				Public Status Page Unavailable
			</div>
			<img src="503.jpg" alt="503 error: Temporarily Unavailable"></iframe>
		`;
		failed_handles.add(pub);
	}
	setTimeout(fetch_public, retry);
}

function handle_vpn(reachable) {
	const pbanner = document.getElementById("public-banner");
	if (reachable) {
		pbanner.innerHTML = "";
		const elem = document.getElementById("vpn");
		elem.classList.add("column");
		elem.innerHTML = '<iframe src="' + vpn + '"></iframe>';
		return;
	}
	if (! failed_handles.has(vpn)) {
		pbanner.innerHTML = `
			<div class="alert warning">
				<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
				VPN Server Unreachable
			</div>
		`;
		failed_handles.add(vpn);
	}
	setTimeout(fetch_vpn, retry);
}

function handle_priv(reachable) {
	if (reachable) {
		const elem = document.getElementById("private");
		elem.classList.add("column");
		elem.innerHTML = '<iframe src="' + priv + '"></iframe>';
		return;
	}
	setTimeout(fetch_priv, retry);
}


// Fetch

function start_frame(url, handle) {
	fetch(url, {mode: 'no-cors', signal: AbortSignal.timeout(1000)})
		.then(r=>{handle(true);})
		.catch(e=>{handle(false);});
}

function fetch_public() { start_frame(pub, handle_pub); }
function fetch_vpn() { start_frame(vpn, handle_vpn); }
function fetch_priv() { start_frame(priv, handle_priv); }

// Main

fetch_public();
fetch_vpn();
fetch_priv();
