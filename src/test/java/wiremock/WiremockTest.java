package wiremock;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import com.github.tomakehurst.wiremock.junit.WireMockRule;

public class WiremockTest {

	Client client;
	WebTarget target;

	@Before
	public void setUp() {
		client = ClientBuilder.newClient();
		target = client.target("http://localhost:8089").path("/my/resource");
	}
	
	@Rule
	public WireMockRule wireMockRule = new WireMockRule(8089);
	
	@Test
	public void exampleTest() {
		stubFor(get(urlEqualTo("/my/resource"))
				.withHeader("Accept", equalTo("text/xml"))
				.willReturn(aResponse()
						.withStatus(200)
						.withHeader("Content-Type", "text/xml")
						.withBody("<response>cake</response>")));

		Response response = target.request(MediaType.TEXT_XML).get();
		
		assertThat(response.getStatus(), is(200));
		assertThat(response.readEntity(String.class), containsString(">cake<"));
	}

}
