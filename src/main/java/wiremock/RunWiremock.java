package wiremock;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;

public class RunWiremock {

	public static void main(String[] args) {
		
		WireMockServer server = new WireMockServer(wireMockConfig()
				.withRootDirectory("src/main/resources").port(8089));
		
		server.stubFor(get(urlEqualTo("/logo/test"))
				.willReturn(aResponse().withStatus(200)
						.withHeader("Content-Type", "application/json")
						.withHeader("Access-Control-Allow-Origin", "*")
						.withBodyFile("results.json")));

		server.stubFor(get(urlEqualTo("/logo/matchInfo?matched"))
				.willReturn(aResponse().withStatus(200)
						.withHeader("Access-Control-Allow-Origin", "*")
						.withBodyFile("nikeMatchInfo.png")));
		
		server.stubFor(get(urlEqualTo("/logo/matchInfo?nomatch"))
				.willReturn(aResponse().withStatus(200)
						.withHeader("Access-Control-Allow-Origin", "*")
						.withBodyFile("nomatch.jpg")));
		server.start();

		int secs = 0;
		
		while (secs++ < 600) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				break;
			}
		}

		WireMock.reset();

		// Finish doing stuff

		server.stop();
	}
}
