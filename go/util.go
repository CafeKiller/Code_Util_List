// var r *http.Request
ip := exnet.ClientPublicIP(r)
if ip == ""{
  ip = exnet.ClientIP(r)
}

// ClientPublicIP �����Ŭ��ʵ�ֻ�ȡ�ͻ��˹��� IP ���㷨��
// ���� X-Real-IP �� X-Forwarded-For �Ա��ڷ������nginx �� haproxy����������������
func ClientPublicIP(r *http.Request) string {
	var ip string
	for _, ip = range strings.Split(r.Header.Get("X-Forwarded-For"), ",") {
		ip = strings.TrimSpace(ip)
		if ip != "" && !HasLocalIPddr(ip) {
			return ip
		}
	}

	ip = strings.TrimSpace(r.Header.Get("X-Real-Ip"))
	if ip != "" && !HasLocalIPddr(ip) {
		return ip
	}

	if ip, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr)); err == nil {
		if !HasLocalIPddr(ip) {
			return ip
		}
	}

	return ""
}

// HasLocalIPddr ��� IP ��ַ�ַ����Ƿ���������ַ
func HasLocalIPddr(ip string) bool {
	return HasLocalIP(net.ParseIP(ip))
}

// HasLocalIP ��� IP ��ַ�Ƿ���������ַ
func HasLocalIP(ip net.IP) bool {
	for _, network := range localNetworks {
		if network.Contains(ip) {
			return true
		}
	}

	return ip.IsLoopback()
}

// RemoteIP ͨ�� RemoteAddr ��ȡ IP ��ַ�� ֻ��һ�����ٽ���������
func RemoteIP(r *http.Request) string {
	if ip, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr)); err == nil {
		return ip
	}

	return ""
}