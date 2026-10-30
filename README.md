# Cihazlar & Bakım

Home Assistant için cihaz envanteri ve bakım görünümü sunan özel entegrasyon. Entegrasyon Home Assistant'a zaten kayıtlı cihazları kullanır; ağ taraması veya yeni cihaz eşleştirmesi yapmaz.

> **Geliştirme önizlemesi:** Bu depo henüz bir beta sürüm veya gerçek Home Assistant kurulumunda doğrulanmış ürün değildir. Kurulu Home Assistant sürümünü doğrulamadan minimum sürüm bildirilmez. Güncel geliştirme dalı kurulum için kararlı kabul edilmemelidir.

## Özellikler

- Cihazları Home Assistant kayıtlarından keşfeder ve seçilen kapsamda listeler.
- Kompakt envanter ve oda gruplu kart düzenleri sunar.
- Hareket/varlık sensörü durumlarını metin ve ikonla gösterir; bilinmeyen ve erişilemeyen durumları ayrı tutar.
- Home Assistant'ın sağladığı cihaz/entity bilgilerini kullanır. Zigbee2MQTT, Matter veya başka bir entegrasyonun yerine geçmez.

Özelliklerin ve kabul koşullarının durumu [CHANGELOG.md](CHANGELOG.md) dosyasında tutulur. Gerçek cihaz, farklı ekran boyutları ve Home Assistant sürümleri üzerinde doğrulama yapılmadan bu özellikler kurulumunuz için garanti edilmez.

## Kurulum

> Bu adımlar yalnızca bir GitHub Release yayımlandıktan sonra geçerlidir. Şu anda bu depo için yayımlanmış bir kurulum paketi yoktur.

1. HACS → **Entegrasyonlar** → sağ üst menü → **Özel depolar** bölümünü açın.
2. Bu deponun GitHub URL'sini ekleyin ve kategori olarak **Integration** seçin.
3. HACS'te **Cihazlar & Bakım** entegrasyonunu indirin ve Home Assistant'ı yeniden başlatın.
4. **Ayarlar → Cihazlar ve Hizmetler → Entegrasyon ekle** bölümünde **Cihazlar & Bakım** aratın ve kurulum akışını tamamlayın.

İlk sürüm beta olursa, önce az sayıda cihazı kapsama alıp mevcut bakım paketini geri dönüş için koruyun. İki sistemin haftalık raporlarını aynı anda etkinleştirmeyin.

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
