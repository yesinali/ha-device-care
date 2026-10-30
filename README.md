# Cihazlar & Bakım

Home Assistant için cihaz envanteri ve bakım görünümü sunan özel entegrasyon. Entegrasyon Home Assistant'a zaten kayıtlı cihazları kullanır; ağ taraması veya yeni cihaz eşleştirmesi yapmaz.

> **Geliştirme önizlemesi:** Yayımlanmış son sürüm `0.1.0-beta.3`; geliştirme dalı `0.1.0-beta.4` adayıdır. Gerçek bir Home Assistant kurulumunda veya fiziksel cihazlarda doğrulanmış kararlı ürün değildir. CI hedefi Home Assistant Core 2026.10.4'tür; bu, minimum destek sürümü bildirimi değildir.

## Özellikler

- Cihazları Home Assistant kayıtlarından keşfeder ve seçilen kapsamda listeler.
- Kompakt envanter ve oda gruplu kart düzenleri sunar.
- Hareket/varlık sensörü durumlarını metin ve ikonla gösterir; bilinmeyen ve erişilemeyen durumları ayrı tutar.
- Home Assistant'ın sağladığı firmware durumunu salt okunur gösterir. Envanterde firmware sütunu varsayılan olarak kapalıdır; **Düzenle → Tabloda gösterilen sütunlar** bölümünden açılabilir.
- Home Assistant'ın sağladığı cihaz/entity bilgilerini kullanır. Zigbee2MQTT, Matter veya başka bir entegrasyonun yerine geçmez.

Özelliklerin ve kabul koşullarının durumu [CHANGELOG.md](CHANGELOG.md) dosyasında tutulur. Gerçek cihaz, farklı ekran boyutları ve Home Assistant sürümleri üzerinde doğrulama yapılmadan bu özellikler kurulumunuz için garanti edilmez.

## Kurulum

> HACS kurulum adımları yayımlanmış beta.3 sürümü için geçerlidir. Beta.4 adayı henüz yayımlanmış bir GitHub Release değildir; sürüm numarası tek başına kurulum paketi yayımlandığı anlamına gelmez.

1. HACS → **Entegrasyonlar** → sağ üst menü → **Özel depolar** bölümünü açın.
2. Bu deponun GitHub URL'sini ekleyin ve kategori olarak **Integration** seçin.
3. HACS'te **Cihazlar & Bakım** entegrasyonunu indirin ve Home Assistant'ı yeniden başlatın.
4. **Ayarlar → Cihazlar ve Hizmetler → Entegrasyon ekle** bölümünde **Cihazlar & Bakım** aratın ve kurulum akışını tamamlayın.

İlk sürüm beta olursa, önce az sayıda cihazı kapsama alıp mevcut bakım paketini geri dönüş için koruyun. İki sistemin haftalık raporlarını aynı anda etkinleştirmeyin.

### HACS simgesi

Entegrasyonun `brand/icon.png` ve `brand/icon@2x.png` dosyaları depoda bulunur. Home Assistant entegrasyon sayfasındaki marka simgesi ile HACS Marketplace kartındaki simge farklı yüzeylerdir. HACS 2.0.5, bazı kurulumlarda Marketplace CDN yerine eski simge yolunu kullandığı için depo kartında yer tutucu gösterebilir; bu, entegrasyon marka dosyalarının eksik olduğu anlamına gelmez. HACS sürümünüz bilinmiyorsa önce sürümü kontrol edin. İncelenen upstream düzeltmenin Home Assistant 2026.11 Marketplace dağıtımına girmesi planlanmıştır; 2026.10.x'te `hacs.json` için desteklenmeyen bir `icon` alanı eklemek çözüm değildir.

## Gizlilik ve kapsam

Entegrasyon Home Assistant'ın yerel kayıtlarını ve durumlarını kullanmak üzere tasarlanmıştır. Bu depo kullanıcıya özel entity envanteri, adres, token veya ekran görüntüsü içermemelidir. Dış bulut ya da yapay zekâ servisine veri gönderimi planlanmamıştır.

Sağlık geçmişi yalnızca entegrasyon kurulduktan ve izleme başladıktan sonraki gözlemleri kapsar. Home Assistant kapalıyken geçen aralık bilinmeyen kabul edilir; geçmişe dönük kesinti veya yüzde uptime uydurulmaz. “Son güncelleme” zamanı fiziksel son iletişim olarak yorumlanmaz.

## Geliştirme

Geliştirme için Home Assistant test ortamı ve Node.js gerekir. Kullanıcıların Home Assistant üzerinde Node/npm çalıştırması gerekmez; arayüzün derlenmiş dosyaları entegrasyon paketinde dağıtılır.

```sh
cd frontend-src
npm ci
npm test
npm run typecheck
```

Python model/rapor testleri ve modül derlemesi, Home Assistant Core 2026.10.4 ile izole bir ortamda çalıştırılabilir:

```sh
python3.14 -m pip install "homeassistant==2026.10.4" pytest
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 python3.14 -m pytest -q tests/test_core.py
python3.14 -m compileall -q custom_components/device_care
```

An isolated Home Assistant lifecycle smoke check is also included. It starts a
temporary instance and should only be run in a disposable environment:

```sh
python3.14 -m pip install "homeassistant==2026.10.4"
python3.14 tests/runtime_check.py
```

The smoke check skips HA's optional dependency installer and stubs network
adapter discovery for containers without network interfaces. It does not
validate hardware integrations or a user's Home Assistant configuration.

CI bu Home Assistant sürümünü test hedefi olarak kullanır. Bu hedef, henüz bildirilmiş bir minimum destek sürümü anlamına gelmez. CI ve yerel kontroller gerçek Home Assistant kurulumu, cihaz uyumluluğu veya kullanıcı arayüzünün canlı doğrulaması yerine geçmez.

## Katkı ve hata bildirimi

Hata bildirirken Home Assistant ve HACS sürümünü, beklenen/gerçek davranışı ve yeniden üretme adımlarını paylaşın. Hassas ev yapılandırmasını, token'ları, IP adreslerini veya gerçek entity dökümlerini eklemeyin; örnek verileri anonimleştirin. Ayrıntılar için [CONTRIBUTING.md](CONTRIBUTING.md) sayfasına bakın.
