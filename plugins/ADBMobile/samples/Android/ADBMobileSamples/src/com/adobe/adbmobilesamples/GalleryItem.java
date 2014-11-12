/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

public class GalleryItem {
	public String title;
	public String assetName;
	public String description;
	private static int GALLERY_ITEM_COUNT = 25;
	private static String GALLERY_DESCRIPTION = "Adobe's Utah office is in Lehi, just 25 minutes south of Salt Lake City. It is home to more than 900 employees who work at a newly built state-of-the-art campus and building with panoramic views, a full gym, and an NBA size basketball court, providing a unique work/life balance combining a spirit of innovation and abundant recreational opportunities. The team in Utah is focused on engineering, product development, sales, marketing, and operations for the industry-leading Adobe® Marketing Cloud.";

	public GalleryItem(String newTitle, String newAssetName, String newDescription) {
		title = newTitle;
		assetName = newAssetName;
		description = newDescription;
	}

	public static GalleryItem[] GetGalleryItems() {
		GalleryItem[] items = new GalleryItem[GALLERY_ITEM_COUNT];

		items[0] = new GalleryItem("Atrium #1", "atrium1", GALLERY_DESCRIPTION);
		items[1] = new GalleryItem("Atrium #2", "atrium2", GALLERY_DESCRIPTION);
		items[2] = new GalleryItem("Atrium #3", "atrium3", GALLERY_DESCRIPTION);
		items[3] = new GalleryItem("Couch", "yellow", GALLERY_DESCRIPTION);
		items[4] = new GalleryItem("Purple", "purple", GALLERY_DESCRIPTION);
		items[5] = new GalleryItem("Railing", "stairs", GALLERY_DESCRIPTION);
		items[6] = new GalleryItem("Cafe", "cafe", GALLERY_DESCRIPTION);
		items[7] = new GalleryItem("Pantone", "pantone", GALLERY_DESCRIPTION);
		items[8] = new GalleryItem("Above", "above", GALLERY_DESCRIPTION);
		items[9] = new GalleryItem("Mario", "mario", GALLERY_DESCRIPTION);
		items[10] = new GalleryItem("Drips", "drips", GALLERY_DESCRIPTION);
		items[11] = new GalleryItem("El Mac", "elmac", GALLERY_DESCRIPTION);
		items[12] = new GalleryItem("Chairs", "chairs", GALLERY_DESCRIPTION);
		items[13] = new GalleryItem("Lattice", "lattice", GALLERY_DESCRIPTION);
		items[14] = new GalleryItem("Razor Edge", "razor", GALLERY_DESCRIPTION);
		items[15] = new GalleryItem("Back Stairs", "stairs2", GALLERY_DESCRIPTION);
		items[16] = new GalleryItem("Dizzy", "zebra", GALLERY_DESCRIPTION);
		items[17] = new GalleryItem("Below", "below", GALLERY_DESCRIPTION);
		items[18] = new GalleryItem("Interactive", "touch", GALLERY_DESCRIPTION);
		items[19] = new GalleryItem("Words", "words", GALLERY_DESCRIPTION);
		items[20] = new GalleryItem("Basketball", "bball", GALLERY_DESCRIPTION);
		items[21] = new GalleryItem("Elements", "elements", GALLERY_DESCRIPTION);
		items[22] = new GalleryItem("Dusk", "dusk", GALLERY_DESCRIPTION);
		items[23] = new GalleryItem("Atrium Dusk", "atriumdusk", GALLERY_DESCRIPTION);
		items[24] = new GalleryItem("Halls", "halls", GALLERY_DESCRIPTION);

		return items;
	}
}
