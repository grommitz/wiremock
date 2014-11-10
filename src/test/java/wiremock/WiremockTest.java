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

	@Before
	public void setUp() {
		client = ClientBuilder.newClient();
	}
	
	private WebTarget target(String path) {
		return client.target("http://localhost:8089").path(path);
	}
	
	@Rule
	public WireMockRule wireMockRule = new WireMockRule(8089);
	
	@Test
	public void getTextXml() {
		stubFor(get(urlEqualTo("/my/resource"))
				.withHeader("Accept", equalTo("text/xml"))
				.willReturn(aResponse()
						.withStatus(200)
						.withHeader("Content-Type", "text/xml")
						.withBody("<response>cake</response>")));

		Response response = target("/my/resource").request(MediaType.TEXT_XML).get();
		
		assertThat(response.getStatus(), is(200));
		assertThat(response.readEntity(String.class), containsString(">cake<"));
	}

	@Test
	public void getJsonEntity() {
		stubFor(get(urlEqualTo("/tvs"))
				.withHeader("Accept", equalTo("application/json"))
				.willReturn(aResponse()
						.withStatus(200)
						.withHeader("Content-Type", "application/json")
						.withBody("{ \"brand\":\"Sony\" , \"size\":43 }")));

		Response response = target("/tvs").request(MediaType.APPLICATION_JSON).get();
		
		assertThat(response.getStatus(), is(200));
		assertThat(response.readEntity(Tele.class), is(new Tele("Sony", 43)));
	}

	// serializable entity: must be static, must have default ctor,
	// fields must be public or have public getter/setter
	public static class Tele {
		public String brand;
		private int size;
		public Tele(String brand, int size) {
			this.brand = brand;
			this.size = size;
		}
		
		public Tele() {}
		
		@Override
		public boolean equals(Object obj) {
			Tele other = (Tele) obj;
			return this.brand.equals(other.brand) && this.size == other.size;
		}
		public int getSize() {
			return size;
		}
		public void setSize(int size) {
			this.size = size;
		}
	}
	
}
