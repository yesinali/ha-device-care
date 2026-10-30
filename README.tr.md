# Cihazlar & Bakım

Cihazlar & Bakım, Home Assistant'ın zaten bildiği seçili cihazları envanter olarak görmenizi ve mevcut cihaz sağlık bilgilerini incelemenizi sağlayan özel bir entegrasyondur. Home Assistant cihaz ve varlık kayıtlarını kullanır; ağ taraması yapmaz, cihaz eşleştirmez ve cihazları Home Assistant'a bağlayan entegrasyonların yerini almaz.

![Cihazlar & Bakım marka simgesi](custom_components/device_care/brand/icon.png)

> **Beta önizlemesi:** `0.1.0-beta.5` hazırlanıyor ve henüz GitHub sürümü olarak yayımlanmadı. Yayımlanmış en son sürüm daha eski olabilir. Beta yazılımı test edilmektedir; denemeden önce Home Assistant yapılandırmanızı yedekleyin.

Katkıda bulunanlar ve bakım yapanlar için [DEVELOPMENT.md](DEVELOPMENT.md) sayfasına bakın.

## Özellikler

- Aranabilir cihaz envanteri, kompakt liste ve odaya göre gruplanmış görünüm sunar.
- Alan, kat, etiket, entegrasyon veya elle seçim yoluyla izlenecek cihazları belirlemenizi sağlar. Kapsama daha sonra uyan yeni cihazları otomatik eklemeyi seçebilirsiniz.
- Home Assistant ve cihaz entegrasyonu tarafından sağlanıyorsa pil, sensör, etkinlik ve sağlık bilgilerini gösterir.
- Home Assistant'ın bildirdiği firmware sürümünü ve güncelleme durumunu gösterebilir. Bu bilgiler salt okunurdur; entegrasyon firmware yüklemez.
- İzleme başladıktan sonraki olay geçmişini tutar. Daha eski geçmişi veya Home Assistant'ın erişilemediği dönemler için çalışma süresi yüzdesini uydurmaz.
- Home Assistant dil ayarını izler. İngilizce (ABD) ve Türkçe desteklenir. Tarihler Home Assistant saat dilimini kullanır.

Cihazlar & Bakım her cihaz için anlık erişilebilirliği belirleyemez. Yakın zamanda gelen etkinlik veya pil ölçümü cihazın şu anda çevrimiçi olduğunu kanıtlamaz. Bazı entegrasyonlar pil, bağlantı, etkinlik veya firmware bilgisi sağlamaz; bu bilgiler kullanılamayabilir.

## HACS ile kurulum

Cihazlar & Bakım özel bir HACS deposudur:

`https://github.com/yesinali/ha-device-care`

1. Home Assistant'ta **HACS → Entegrasyonlar** bölümünü açın, menüden **Özel depolar** seçeneğine girin.
2. Yukarıdaki depo URL'sini ekleyin ve kategori olarak **Integration** seçin.
3. Depoyu ekleyin, HACS'te **Cihazlar & Bakım** öğesini bulun, sunulan sürümü indirin ve Home Assistant'ı yeniden başlatın.
4. **Ayarlar → Cihazlar ve Hizmetler → Entegrasyon ekle** bölümünde **Cihazlar & Bakım** aratın ve kurulum adımlarını tamamlayın.
5. Cihaz kapsamını ve izlenecek cihazları seçin. Cihazlar & Bakım paneli Home Assistant kenar çubuğunda yöneticilere görünür.

Beta.5 kaynak kodu henüz GitHub sürümü olarak yayımlanmadı. Bu nedenle HACS, beta.5 sürümünü yayımlanana kadar kuramaz. Kaynak dosyalardaki sürüm numarası tek başına sürümün yayımlandığını göstermez. HACS'te görünen en yeni sürümü kullanın veya beta.5'i bekleyin.

### İsteğe bağlı ayarlar

Cihaz kontrol ayarları varsayılan olarak kilitlidir. Desteklenen Home Assistant kontrollerini değiştirmeden önce yöneticinin Cihazlar & Bakım panelinde izni açıkça etkinleştirmesi gerekir. İzin geçicidir; bağlantı kesildiğinde, cihaz kapsamı değiştiğinde veya yeni oturum başladığında sıfırlanır. Yalnızca Home Assistant'ın gerekli yapılandırma bilgisiyle sunduğu desteklenen kontroller değiştirilebilir. Firmware yükleme seçeneği yoktur.

Firmware sütunu başlangıçta gizlidir. Home Assistant firmware bilgisi sağlıyorsa panelde **Düzenle → Tablo sütunları** bölümünden gösterebilirsiniz.

### HACS simgesi

Entegrasyonun yerel marka dosyaları `custom_components/device_care/brand/` altında bulunur. Entegrasyon ayrıntısında ve HACS Marketplace depo kartında farklı simge kaynakları kullanılabilir. HACS 2.0.5, Marketplace/CDN simge yolu nedeniyle depo kartında yer tutucu gösterebilir; yerel marka dosyaları yine de pakettedir. Depoya çözüm olarak desteklenmeyen `hacs.json` `icon` alanı eklenmez.

## Güncelleme, geri alma ve kaldırma

- **Güncelleme:** HACS'te sunulan sürümü kurun ve Home Assistant'ı yeniden başlatın. Önce sürüm notlarını inceleyin.
- **Geri alma:** HACS önceki bir sürüm sunuyorsa onu seçin ve yeniden başlatın. Gerekirse entegrasyon dosyalarını ve yapılandırmayı geri yükleyebilmek için Home Assistant yedeği bulundurun.
- **Kaldırma:** Cihazlar & Bakım'ı HACS'ten kaldırın ve Home Assistant'ı yeniden başlatın. Kaldırma izlemeyi durdurur ve paneli kaldırır. Saklanan tercihler ve olay geçmişi kaldırma sonrasında Home Assistant depolamasında kalabilir; bu sürüm panelden ayrı veri silme seçeneği sunmaz. Entegrasyon çalışırken geçmiş, 1–365 günlük saklama ayarıyla (varsayılan 30 gün) ve 20.000 olay sınırıyla tutulur. Home Assistant çalışırken `.storage` dosyalarını düzenlemeyin; dosya düzeyinde bakım öncesi tam yedek bulundurun.

## Gizlilik ve destek

Cihazlar & Bakım Home Assistant'ın yerel cihaz kaydını, varlık kaydını ve varlık durumlarını okur. Harici bulut veya yapay zekâ hizmeti kullanmaz. Geçmiş izleme başladığında oluşur; kurulum öncesi veya Home Assistant'ın erişilemediği zamanlar sonradan oluşturulmaz.

Sorun bildirirken Home Assistant, Cihazlar & Bakım ve gerekiyorsa HACS sürümünü; beklenen ve gerçekleşen davranışı; yeniden üretme adımlarını ekleyin. Günlükleri paylaşmadan önce erişim anahtarlarını, parolaları, özel URL'leri, genel IP adreslerini ve hassas gördüğünüz cihaz adlarını/kimliklerini silin. Tam yapılandırmanızı veya gizlenmemiş cihaz/varlık dökümünü eklemeyin. [GitHub Issues](https://github.com/yesinali/ha-device-care/issues) üzerinden bildirim yapabilirsiniz.

Cihazlar & Bakım [MIT Lisansı](LICENSE) ile dağıtılır.
